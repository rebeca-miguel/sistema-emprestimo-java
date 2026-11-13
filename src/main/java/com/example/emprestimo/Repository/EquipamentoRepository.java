package com.example.emprestimo.Repository;

import com.example.emprestimo.model.Equipamento;
import com.example.emprestimo.model.TipoEquipamento;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EquipamentoRepository extends JpaRepository<Equipamento, Long> {

    boolean existsByPatrimonio(String patrimonio);

    List<Equipamento> findByTipo(TipoEquipamento tipo);

    List<Equipamento> findByDisponivel(boolean disponivel); //novo

    List<Equipamento> findByTipoAndDisponivel(TipoEquipamento tipo, boolean disponivel); //novo

}
