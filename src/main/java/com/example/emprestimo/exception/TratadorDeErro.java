package com.example.emprestimo.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.stream.Collectors;

@RestControllerAdvice
    public class TratadorDeErro {

        @ExceptionHandler(NaoEncontradoException.class)
        @ResponseStatus(HttpStatus.NOT_FOUND)
        public ErroResposta naoEncontrado(NaoEncontradoException e ){
            return new ErroResposta(e.getMessage());
        }

        @ExceptionHandler(ConflitoException.class)
        @ResponseStatus(HttpStatus.CONFLICT)
        public ErroResposta conflito(ConflitoException e ){
            return new ErroResposta(e.getMessage());
        }

        @ExceptionHandler(MethodArgumentNotValidException.class)
        @ResponseStatus(HttpStatus.BAD_REQUEST)
        public ErroResposta tratarValidacao(MethodArgumentNotValidException e) {

            String mensagem = e.getBindingResult().getFieldErrors().stream()
                .map(erro -> erro.getField() + ": " + erro.getDefaultMessage())
                .collect(Collectors.joining("; "));

            return new ErroResposta(mensagem);
    }

    }
