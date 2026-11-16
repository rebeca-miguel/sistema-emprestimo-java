package com.example.emprestimo.service;

import com.example.emprestimo.model.Emprestimo;
import com.example.emprestimo.repository.EmprestimoRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class EmprestimoService {

    private final EmprestimoRepository repository;

    public EmprestimoService(EmprestimoRepository repository) {
        this.repository = repository;
    }

    public Emprestimo salvar(Emprestimo emprestimo) {
        return repository.save(emprestimo);
    }

    public List<Emprestimo> listarTodos() {
        return repository.findAll();
    }

    public Optional<Emprestimo> buscarPorId(Long id) {
        return repository.findById(id);
    }

    public void excluir(Long id) {
        repository.deleteById(id);
    }
}
