package com.siwms.controller;

import com.siwms.entity.PurchaseOrder;
import com.siwms.service.PurchaseOrderService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/purchase-orders")
public class PurchaseOrderController {

    private final PurchaseOrderService poService;

    public PurchaseOrderController(PurchaseOrderService poService) {
        this.poService = poService;
    }

    @GetMapping
    public ResponseEntity<List<PurchaseOrder>> getAll(
            @RequestParam(required = false) PurchaseOrder.POStatus status) {
        if (status != null) return ResponseEntity.ok(poService.findByStatus(status));
        return ResponseEntity.ok(poService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<PurchaseOrder> getById(@PathVariable Long id) {
        return ResponseEntity.ok(poService.findById(id));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'PROCUREMENT_OFFICER')")
    public ResponseEntity<PurchaseOrder> create(@RequestBody PurchaseOrder po) {
        return ResponseEntity.ok(poService.createDraft(po));
    }

    @PatchMapping("/{id}/submit")
    @PreAuthorize("hasAnyRole('ADMIN', 'PROCUREMENT_OFFICER')")
    public ResponseEntity<PurchaseOrder> submit(@PathVariable Long id) {
        return ResponseEntity.ok(poService.submitForApproval(id));
    }

    @PatchMapping("/{id}/approve")
    @PreAuthorize("hasAnyRole('ADMIN', 'WAREHOUSE_MANAGER')")
    public ResponseEntity<PurchaseOrder> approve(@PathVariable Long id) {
        return ResponseEntity.ok(poService.approve(id, null));
    }

    @PatchMapping("/{id}/receive")
    @PreAuthorize("hasAnyRole('ADMIN', 'WAREHOUSE_MANAGER', 'INVENTORY_STAFF')")
    public ResponseEntity<PurchaseOrder> receive(@PathVariable Long id) {
        return ResponseEntity.ok(poService.receiveGoods(id));
    }

    @PatchMapping("/{id}/cancel")
    @PreAuthorize("hasAnyRole('ADMIN', 'PROCUREMENT_OFFICER', 'WAREHOUSE_MANAGER')")
    public ResponseEntity<PurchaseOrder> cancel(@PathVariable Long id) {
        return ResponseEntity.ok(poService.cancel(id));
    }
}
