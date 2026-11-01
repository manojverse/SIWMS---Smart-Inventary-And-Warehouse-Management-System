package com.siwms.controller;

import com.siwms.entity.Product;
import com.siwms.repository.CategoryRepository;
import com.siwms.repository.ProductRepository;
import com.siwms.repository.SupplierRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/products")
public class ProductController {

    private final ProductRepository productRepository;

    public ProductController(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @GetMapping
    public ResponseEntity<List<Product>> getAll() {
        return ResponseEntity.ok(productRepository.findByActiveTrue());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Product> getById(@PathVariable Long id) {
        return productRepository.findById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/search")
    public ResponseEntity<Page<Product>> search(@RequestParam String q, Pageable pageable) {
        return ResponseEntity.ok(productRepository.searchProducts(q, pageable));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'INVENTORY_STAFF')")
    public ResponseEntity<Product> create(@RequestBody Product product) {
        if (productRepository.existsBySku(product.getSku())) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(productRepository.save(product));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'INVENTORY_STAFF')")
    public ResponseEntity<Product> update(@PathVariable Long id, @RequestBody Product updated) {
        return productRepository.findById(id).map(product -> {
            product.setName(updated.getName());
            product.setDescription(updated.getDescription());
            product.setCostPrice(updated.getCostPrice());
            product.setSellingPrice(updated.getSellingPrice());
            product.setReorderLevel(updated.getReorderLevel());
            product.setMaxStockLevel(updated.getMaxStockLevel());
            product.setUnitOfMeasure(updated.getUnitOfMeasure());
            product.setExpiryTracked(updated.isExpiryTracked());
            return ResponseEntity.ok(productRepository.save(product));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        var opt = productRepository.findById(id);
        if (opt.isPresent()) {
            Product p = opt.get();
            p.setActive(false);
            productRepository.save(p);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}
