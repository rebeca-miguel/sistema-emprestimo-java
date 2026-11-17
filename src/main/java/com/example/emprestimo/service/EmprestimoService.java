package com.example.emprestimo.service;

import com.example.emprestimo.exception.ConflitoException;
import com.example.emprestimo.exception.NaoEncontradoException;
import com.example.emprestimo.model.Emprestimo;
import com.example.emprestimo.repository.EmprestimoRepository;
import com.example.emprestimo.repository.EquipamentoRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class EmprestimoService {

    private final EmprestimoRepository repository;
    private final EquipamentoRepository equipamentoRepository;


    public EmprestimoService(EmprestimoRepository repository, EquipamentoRepository equipamentoRepository) {
        this.repository = repository;
        this.equipamentoRepository = equipamentoRepository;
    }

    //Adicionando a lógica de impedir alguém solicite um equipamento que já esteja emprestado.
    public Emprestimo salvar(Emprestimo emprestimo) {

        if (emprestimo.getDataPrevistaDevolucao().isBefore(emprestimo.getDataEmprestimo())) {
            throw new ConflitoException("A data prevista de devolução não pode ser anterior à data do empréstimo.");
        }
        Long equipamentoId = emprestimo.getEquipamento().getId();


        var equipamento = equipamentoRepository.findById(equipamentoId)
                .orElseThrow(() -> new NaoEncontradoException("Equipamento não encontrado"));

        if (!equipamento.isDisponivel()) {
            throw new ConflitoException("Equipamento não está disponível para empréstimo");
        }
        equipamento.setDisponivel(false);

        equipamentoRepository.save(equipamento);

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

    //buscar por id
    public Emprestimo devolver(Long id) {
        Emprestimo emprstimo = repository.findById(id)
                .orElseThrow(() -> new NaoEncontradoException("Empréstimo não encontrado"));

        // verifica se o equipamento já foi devolvido
        if (emprstimo.getDataDevolucao() != null) {
            throw new ConflitoException("Este equipamento já foi devolvido.");
        }

        //Registra a data de devolução
        emprstimo.setDataDevolucao(LocalDate.now());

        //atualiza a disponibilidade do equipamento
        var equipamento = emprstimo.getEquipamento();
        equipamento.setDisponivel(true);

        equipamentoRepository.save(equipamento);

        //salva a devolução no banco
        return repository.save(emprstimo);

    }


}
