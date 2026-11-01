package com.siwms.repository;

import com.siwms.entity.SalesOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface SalesOrderRepository extends JpaRepository<SalesOrder, Long> {
    Optional<SalesOrder> findBySoNumber(String soNumber);
    List<SalesOrder> findByStatus(SalesOrder.SOStatus status);

    @Query("SELECT SUM(s.total) FROM SalesOrder s WHERE s.orderDate BETWEEN :start AND :end AND s.status != 'CANCELLED'")
    BigDecimal getRevenueForPeriod(LocalDate start, LocalDate end);

    @Query("SELECT COUNT(s) FROM SalesOrder s WHERE s.status IN ('CONFIRMED', 'PICKING', 'SHIPPED')")
    long countActiveOrders();

    @Query("SELECT s FROM SalesOrder s WHERE s.paymentStatus IN ('UNPAID', 'PARTIAL') AND s.status = 'DELIVERED'")
    List<SalesOrder> findOutstandingPayments();
}
