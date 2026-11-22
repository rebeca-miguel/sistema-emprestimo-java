package com.example.emprestimo.service;

import com.example.emprestimo.exception.ConflitoException;
import com.example.emprestimo.exception.NaoEncontradoException;
import com.example.emprestimo.model.Emprestimo;
import com.example.emprestimo.repository.ColaboradorRepository;
import com.example.emprestimo.repository.EmprestimoRepository;
import com.example.emprestimo.repository.EquipamentoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class EmprestimoService {

    private final EmprestimoRepository repository;
    private final EquipamentoRepository equipamentoRepository;
    private final ColaboradorRepository colaboradorRepository;


    public EmprestimoService(EmprestimoRepository repository, EquipamentoRepository equipamentoRepository, ColaboradorRepository colaboradorRepository) {
        this.repository = repository;
        this.equipamentoRepository = equipamentoRepository;
        this.colaboradorRepository = colaboradorRepository;
    }

    //Adicionando a lógica de impedir alguém solicite um equipamento que já esteja emprestado.
    @Transactional
    public Emprestimo salvar(Emprestimo emprestimo) {

        if (emprestimo.getDataPrevistaDevolucao().isBefore(emprestimo.getDataEmprestimo())) {
            throw new ConflitoException("A data prevista de devolução não pode ser anterior à data do empréstimo.");
        }

        //buscar equipamento pelo ID
        Long equipamentoId = emprestimo.getEquipamento().getId();


        var equipamento = equipamentoRepository.findById(equipamentoId)
                .orElseThrow(() -> new NaoEncontradoException("Equipamento não encontrado"));

//VERIFICAR DISPONIBILIDADE
        if (!equipamento.isDisponivel()) {
            throw new ConflitoException("Equipamento não está disponível para empréstimo");
        }

        //bUSCAR COLABORADOR PELO ID
        Long colaboradorId = emprestimo.getColaborador().getId();
        var colaborador = colaboradorRepository.findById(colaboradorId)
                        .orElseThrow(() -> new NaoEncontradoException("Colaborador não encontrado"));

        if (repository.existsByEquipamentoIdAndDataDevolucaoIsNull(equipamentoId)) {
            throw new ConflitoException("Este equipamento já possuí um empréstimo ativo.");
        }

        //ATUALIZAR DISPONIBILIDADE DO EQUIPAMENTO
        equipamento.setDisponivel(false);
        equipamentoRepository.save(equipamento);

        //Associar os objetos completos ao empréstimo
        emprestimo.setEquipamento(equipamento);
        emprestimo.setColaborador(colaborador);


        //SALVAR EMPRÉSTIMO
        return repository.save(emprestimo);
    }

    public List<Emprestimo> listarTodos() {
        return repository.findAll();
    }

    public Optional<Emprestimo> buscarPorId(Long id) {
        return repository.findById(id);
    }

    public void excluir(Long id) {
        Emprestimo emprestimo = repository.findById(id)
                        .orElseThrow(() -> new NaoEncontradoException("Empréstimo não encontrado."));

        throw new ConflitoException("Não é permitido excluir empréstimos para preservar o histórico.");
    }

    //buscar por id
    @Transactional
    public Emprestimo devolver(Long id) {
        Emprestimo emprstimo = repository.findById(id)
                .orElseThrow(() -> new NaoEncontradoException("Empréstimo não encontrado"));

        // verifica se o equipamento já foi devolvido
        //Registra a data de devolução
        try {
            emprstimo.devolver(LocalDate.now());

        } catch (IllegalArgumentException e) {
            throw new ConflitoException(e.getMessage());
        }

        //atualiza a disponibilidade do equipamento
        var equipamento = emprstimo.getEquipamento();
        equipamento.setDisponivel(true);

        equipamentoRepository.save(equipamento);

        //salva a devolução no banco
        return repository.save(emprstimo);

    }


}
