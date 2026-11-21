package com.example.emprestimo.repository;

import com.example.emprestimo.model.Colaborador;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ColaboradorRepository extends JpaRepository<Colaborador, Long> {

    boolean existsByMatricula(String matricula);

    boolean existsByEmail(String email);

    boolean existsByMatriculaAndIdNot(String matricula, Long id);

    boolean existsByEmailAndIdNot(String email, Long id);
}
