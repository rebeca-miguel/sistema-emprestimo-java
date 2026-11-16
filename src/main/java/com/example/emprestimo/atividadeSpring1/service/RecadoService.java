package com.example.emprestimo.atividadeSpring1.service;

import com.example.emprestimo.atividadeSpring1.repository.RecadoRepository;
import com.example.emprestimo.atividadeSpring1.model.Recado;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RecadoService {

    private final RecadoRepository repository;

    public RecadoService(RecadoRepository repository) {
        this.repository = repository;
    }

    public List<Recado> listar(){
        return repository.findAll();
    }

    public Recado cadastrar(Recado recado) {
        return repository.save(recado);
    }
}
