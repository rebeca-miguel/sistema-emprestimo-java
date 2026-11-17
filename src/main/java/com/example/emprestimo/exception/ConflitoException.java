package com.example.emprestimo.exception;

public class ConflitoException extends RuntimeException{

    public ConflitoException(String mensagem) {
        super(mensagem);
    }
}
