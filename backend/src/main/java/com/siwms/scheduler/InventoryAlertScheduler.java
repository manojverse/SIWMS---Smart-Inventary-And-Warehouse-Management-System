package com.siwms.scheduler;

import com.siwms.entity.Inventory;
import com.siwms.service.InventoryService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import java.util.List;

@Component
public class InventoryAlertScheduler {
    private static final Logger log = LoggerFactory.getLogger(InventoryAlertScheduler.class);

    private final InventoryService inventoryService;
    private final JavaMailSender mailSender;

    public InventoryAlertScheduler(InventoryService inventoryService, JavaMailSender mailSender) {
        this.inventoryService = inventoryService;
        this.mailSender = mailSender;
    }

    /**
     * Run every day at 6:00 AM IST — check for low stock and expiring items
     */
    @Scheduled(cron = "0 0 6 * * *", zone = "Asia/Kolkata")
    public void runDailyStockCheck() {
        log.info("Running daily inventory alert check...");

        List<Inventory> lowStock = inventoryService.getLowStockItems();
        List<Inventory> outOfStock = inventoryService.getOutOfStockItems();
        List<Inventory> expiring30 = inventoryService.getExpiringItems(30);

        log.warn("Low stock items: {}", lowStock.size());
        log.warn("Out of stock items: {}", outOfStock.size());
        log.warn("Expiring within 30 days: {}", expiring30.size());

        if (!lowStock.isEmpty() || !outOfStock.isEmpty()) {
            sendAlertEmail("inventory-alerts@siwms.com",
                "SIWMS Daily Inventory Alert",
                buildAlertBody(lowStock, outOfStock, expiring30));
        }
    }

    /**
     * Check expiry every day at 5:00 AM IST
     */
    @Scheduled(cron = "0 0 5 * * *", zone = "Asia/Kolkata")
    public void runExpiryCheck() {
        List<Inventory> expiring7 = inventoryService.getExpiringItems(7);
        if (!expiring7.isEmpty()) {
            log.error("CRITICAL: {} items expiring within 7 days!", expiring7.size());
        }
    }

    private String buildAlertBody(List<Inventory> low, List<Inventory> out, List<Inventory> expiring) {
        StringBuilder sb = new StringBuilder();
        sb.append("SIWMS Daily Inventory Alert\n\n");
        sb.append("Out of Stock: ").append(out.size()).append(" items\n");
        sb.append("Low Stock: ").append(low.size()).append(" items\n");
        sb.append("Expiring in 30 days: ").append(expiring.size()).append(" items\n\n");
        sb.append("Please log in to SIWMS to take action.\n");
        return sb.toString();
    }

    private void sendAlertEmail(String to, String subject, String body) {
        try {
            SimpleMailMessage msg = new SimpleMailMessage();
            msg.setTo(to);
            msg.setSubject(subject);
            msg.setText(body);
            mailSender.send(msg);
        } catch (Exception e) {
            log.error("Failed to send alert email: {}", e.getMessage());
        }
    }
}
