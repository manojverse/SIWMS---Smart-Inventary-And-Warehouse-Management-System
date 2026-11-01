package com.siwms.service;

import com.siwms.entity.PurchaseOrder;
import com.siwms.entity.User;
import com.siwms.repository.PurchaseOrderRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
public class PurchaseOrderService {

    private final PurchaseOrderRepository poRepository;

    public PurchaseOrderService(PurchaseOrderRepository poRepository) {
        this.poRepository = poRepository;
    }

    public List<PurchaseOrder> findAll() {
        return poRepository.findAll();
    }

    public List<PurchaseOrder> findByStatus(PurchaseOrder.POStatus status) {
        return poRepository.findByStatus(status);
    }

    public PurchaseOrder findById(Long id) {
        return poRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Purchase Order not found: " + id));
    }

    @Transactional
    public PurchaseOrder createDraft(PurchaseOrder po) {
        po.setStatus(PurchaseOrder.POStatus.DRAFT);
        po.setOrderDate(LocalDate.now());
        return poRepository.save(po);
    }

    @Transactional
    public PurchaseOrder submitForApproval(Long id) {
        PurchaseOrder po = findById(id);
        po.setStatus(PurchaseOrder.POStatus.PENDING);
        return poRepository.save(po);
    }

    @Transactional
    public PurchaseOrder approve(Long id, User approver) {
        PurchaseOrder po = findById(id);
        po.setStatus(PurchaseOrder.POStatus.APPROVED);
        po.setApprovedBy(approver);
        return poRepository.save(po);
    }

    @Transactional
    public PurchaseOrder receiveGoods(Long id) {
        PurchaseOrder po = findById(id);
        po.setStatus(PurchaseOrder.POStatus.RECEIVED);
        po.setActualDeliveryDate(LocalDate.now());
        return poRepository.save(po);
    }

    @Transactional
    public PurchaseOrder cancel(Long id) {
        PurchaseOrder po = findById(id);
        po.setStatus(PurchaseOrder.POStatus.CANCELLED);
        return poRepository.save(po);
    }
}
