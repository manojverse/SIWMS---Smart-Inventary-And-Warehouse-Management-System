package com.siwms.repository;

import com.siwms.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    List<User> findByRole(User.UserRole role);
    List<User> findByActiveTrue();
    @Query("SELECT u FROM User u WHERE u.warehouse.id = :warehouseId")
    List<User> findByWarehouseId(Long warehouseId);
}
