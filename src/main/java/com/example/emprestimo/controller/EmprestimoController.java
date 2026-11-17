package com.example.emprestimo.controller;

import com.example.emprestimo.exception.NaoEncontradoException;
import com.example.emprestimo.model.Emprestimo;
import com.example.emprestimo.service.EmprestimoService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/emprestimos")
public class EmprestimoController {

    private final EmprestimoService service;

    public EmprestimoController(EmprestimoService service) {
        this.service = service;
    }

    @PostMapping
    public Emprestimo salvar(@RequestBody Emprestimo emprestimo) {
        return service.salvar(emprestimo);
    }

    @GetMapping
    public List<Emprestimo> listarTodos() {
        return service.listarTodos();
    }

    @GetMapping("/{id}")
    public Emprestimo buscarPorId(@PathVariable Long id){
        return service.buscarPorId(id)
                .orElseThrow(() -> new NaoEncontradoException("Empréstimo não encontrado"));
    }

    @DeleteMapping("/{id}")
    public void excluir(@PathVariable Long id) {
        service.excluir(id);
    }

    @PutMapping("/{id}/devolver")
    public Emprestimo devolver(@PathVariable Long id) {
        return service.devolver(id);
    }

}
