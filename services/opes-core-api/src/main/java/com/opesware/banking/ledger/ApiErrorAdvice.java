package com.opesware.banking.ledger;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.ConstraintViolationException;
import java.util.Map;
import org.springframework.http.*;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class ApiErrorAdvice {
    @ExceptionHandler(LedgerService.Problem.class)
    public ResponseEntity<Map<String,Object>> problem(LedgerService.Problem ex) {
        return ResponseEntity.status(ex.status())
            .body(Map.of("code",ex.code(),"status",ex.status().value()));
    }
    @ExceptionHandler({IllegalArgumentException.class,
        MethodArgumentNotValidException.class, ConstraintViolationException.class})
    public ResponseEntity<Map<String,Object>> invalid(Exception ignored) {
        return ResponseEntity.status(HttpStatus.UNPROCESSABLE_ENTITY)
            .body(Map.of("code","INVALID_JOURNAL_REQUEST","status",422));
    }
}
