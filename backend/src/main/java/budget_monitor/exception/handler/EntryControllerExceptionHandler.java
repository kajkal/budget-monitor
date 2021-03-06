package budget_monitor.exception.handler;

import budget_monitor.controller.EntryController;
import budget_monitor.dto.output.ErrorMessageDTO;
import budget_monitor.exception.type.EntryException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.stream.Collectors;

@RestControllerAdvice(assignableTypes = EntryController.class)
public class EntryControllerExceptionHandler {

    private final Logger log = LoggerFactory.getLogger(getClass());

    @ExceptionHandler({EntryException.class})
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ErrorMessageDTO handleControllerException(Exception e) {
        log.warn(e.getMessage());
        return new ErrorMessageDTO(e.getMessage());
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ErrorMessageDTO handleMethodArgumentNotValidException(MethodArgumentNotValidException e) {

        String notValidFieldNames = e
                .getBindingResult()
                .getFieldErrors()
                .stream()
                .map(FieldError::getField)
                .collect(Collectors.joining(","));

        log.warn("validation error: [" + notValidFieldNames + "]");
        return new ErrorMessageDTO("entryData.error.notValid[" + notValidFieldNames + ']');
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ErrorMessageDTO handleMethodArgumentNotValidException(HttpMessageNotReadableException e) {
        log.warn(e.getMessage());
        return new ErrorMessageDTO("entryData.error.badRequest");
    }

    @ExceptionHandler(Exception.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public ErrorMessageDTO handleUnknownException(Exception e) {
        log.warn(e.getMessage());
        return new ErrorMessageDTO("entryData.error.unknownError");
    }

}
