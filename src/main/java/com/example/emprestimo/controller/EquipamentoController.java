package com.example.emprestimo.controller;

import com.example.emprestimo.model.Equipamento;
import com.example.emprestimo.model.TipoEquipamento;
import com.example.emprestimo.service.EquipamentoService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/equipamentos")
public class EquipamentoController {

    private final EquipamentoService service;

    public EquipamentoController(EquipamentoService service) {
        this.service = service;
    }

    //listar equipamento com filtros opcionais

    @GetMapping
    public List<Equipamento> listar(
            @RequestParam(required = false)TipoEquipamento tipo,
            @RequestParam(required = false) Boolean disponivel) {
        return  service.listar(tipo, disponivel);
    }

    //buscar por ID
    @GetMapping("/{id}")
    public Equipamento buscar(@PathVariable Long id) {
        return service.buscar(id);
    }

    //cadastrar equipamento
    @PostMapping
    public Equipamento cadastrar(@RequestBody @Valid Equipamento equipamento) {
        return service.cadastrar(equipamento);
    }


}
