package com.siwms.repository;

import com.siwms.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    Optional<Product> findBySku(String sku);
    Optional<Product> findByBarcode(String barcode);
    boolean existsBySku(String sku);
    List<Product> findByActiveTrue();
    List<Product> findByCategoryId(Long categoryId);
    List<Product> findBySupplierId(Long supplierId);

    @Query("SELECT p FROM Product p WHERE p.active = true AND " +
           "(LOWER(p.name) LIKE LOWER(CONCAT('%', :q, '%')) OR " +
           " LOWER(p.sku) LIKE LOWER(CONCAT('%', :q, '%')) OR " +
           " p.barcode LIKE CONCAT('%', :q, '%'))")
    Page<Product> searchProducts(@Param("q") String query, Pageable pageable);
}
