package com.siwms.controller;

import com.siwms.entity.SalesOrder;
import com.siwms.service.SalesOrderService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/sales-orders")
public class SalesOrderController {

    private final SalesOrderService soService;

    public SalesOrderController(SalesOrderService soService) {
        this.soService = soService;
    }

    @GetMapping
    public ResponseEntity<List<SalesOrder>> getAll() {
        return ResponseEntity.ok(soService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<SalesOrder> getById(@PathVariable Long id) {
        return ResponseEntity.ok(soService.getById(id));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'SALES_EXECUTIVE')")
    public ResponseEntity<SalesOrder> create(@RequestBody SalesOrder so) {
        return ResponseEntity.ok(soService.createOrder(so));
    }

    @PatchMapping("/{id}/confirm")
    @PreAuthorize("hasAnyRole('ADMIN', 'SALES_EXECUTIVE', 'WAREHOUSE_MANAGER')")
    public ResponseEntity<SalesOrder> confirm(@PathVariable Long id) {
        return ResponseEntity.ok(soService.confirm(id));
    }

    @PatchMapping("/{id}/ship")
    @PreAuthorize("hasAnyRole('ADMIN', 'WAREHOUSE_MANAGER', 'INVENTORY_STAFF')")
    public ResponseEntity<SalesOrder> ship(@PathVariable Long id) {
        return ResponseEntity.ok(soService.ship(id));
    }

    @PatchMapping("/{id}/deliver")
    @PreAuthorize("hasAnyRole('ADMIN', 'SALES_EXECUTIVE', 'WAREHOUSE_MANAGER')")
    public ResponseEntity<SalesOrder> deliver(@PathVariable Long id) {
        return ResponseEntity.ok(soService.markDelivered(id));
    }

    @PatchMapping("/{id}/return")
    @PreAuthorize("hasAnyRole('ADMIN', 'SALES_EXECUTIVE', 'WAREHOUSE_MANAGER')")
    public ResponseEntity<SalesOrder> processReturn(@PathVariable Long id) {
        return ResponseEntity.ok(soService.processReturn(id));
    }
}
