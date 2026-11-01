package com.siwms.repository;

import com.siwms.entity.PurchaseOrder;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface PurchaseOrderRepository extends JpaRepository<PurchaseOrder, Long> {
    Optional<PurchaseOrder> findByPoNumber(String poNumber);
    List<PurchaseOrder> findByStatus(PurchaseOrder.POStatus status);
    List<PurchaseOrder> findBySupplierId(Long supplierId);
    Page<PurchaseOrder> findByOrderByCreatedAtDesc(Pageable pageable);

    @Query("SELECT COUNT(p) FROM PurchaseOrder p WHERE p.status = 'PENDING'")
    long countPendingOrders();

    @Query("SELECT SUM(p.totalAmount) FROM PurchaseOrder p WHERE p.orderDate BETWEEN :start AND :end AND p.status != 'CANCELLED'")
    BigDecimal getTotalPurchasesForPeriod(LocalDate start, LocalDate end);

    @Query("SELECT p FROM PurchaseOrder p WHERE p.status NOT IN ('RECEIVED', 'CANCELLED') AND p.expectedDeliveryDate < :today")
    List<PurchaseOrder> findOverdueOrders(LocalDate today);
}
