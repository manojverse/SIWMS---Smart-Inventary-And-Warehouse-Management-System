package com.siwms.service;

import com.siwms.entity.SalesOrder;
import com.siwms.repository.SalesOrderRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
public class SalesOrderService {

    private final SalesOrderRepository soRepository;

    public SalesOrderService(SalesOrderRepository soRepository) {
        this.soRepository = soRepository;
    }

    public List<SalesOrder> findAll() {
        return soRepository.findAll();
    }

    public SalesOrder getById(Long id) {
        return soRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Sales Order not found: " + id));
    }

    @Transactional
    public SalesOrder createOrder(SalesOrder so) {
        so.setStatus(SalesOrder.SOStatus.DRAFT);
        so.setOrderDate(LocalDate.now());
        return soRepository.save(so);
    }

    @Transactional
    public SalesOrder confirm(Long id) {
        SalesOrder so = getById(id);
        so.setStatus(SalesOrder.SOStatus.CONFIRMED);
        return soRepository.save(so);
    }

    @Transactional
    public SalesOrder ship(Long id) {
        SalesOrder so = getById(id);
        so.setStatus(SalesOrder.SOStatus.SHIPPED);
        so.setShipDate(LocalDate.now());
        return soRepository.save(so);
    }

    @Transactional
    public SalesOrder markDelivered(Long id) {
        SalesOrder so = getById(id);
        so.setStatus(SalesOrder.SOStatus.DELIVERED);
        so.setDeliveredDate(LocalDate.now());
        return soRepository.save(so);
    }

    @Transactional
    public SalesOrder processReturn(Long id) {
        SalesOrder so = getById(id);
        so.setStatus(SalesOrder.SOStatus.RETURNED);
        return soRepository.save(so);
    }
}
