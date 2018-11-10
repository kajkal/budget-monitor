package budget_monitor.exception.handler;

import budget_monitor.controller.CategoryController;
import budget_monitor.dto.output.ErrorMessageDTO;
import budget_monitor.exception.type.CategoryException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;

import java.util.stream.Collectors;

@ControllerAdvice(assignableTypes = CategoryController.class)
public class CategoryControllerExceptionHandler {

    private final Logger log = LoggerFactory.getLogger(getClass());

    @ExceptionHandler(CategoryException.class)
    @ResponseBody
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ErrorMessageDTO handleControllerException(Exception e) {
        log.warn(e.getMessage());
        return new ErrorMessageDTO(e.getMessage());
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseBody
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ErrorMessageDTO handleMethodArgumentNotValidException(MethodArgumentNotValidException e) {

        String notValidFieldNames = e
                .getBindingResult()
                .getFieldErrors()
                .stream()
                .map(FieldError::getField)
                .collect(Collectors.joining(","));

        log.warn("validation error: [" + notValidFieldNames + "]");
        return new ErrorMessageDTO("categoryData.error.notValid[" + notValidFieldNames + ']');
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    @ResponseBody
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ErrorMessageDTO handleMethodArgumentNotValidException(HttpMessageNotReadableException e) {
        log.warn(e.getMessage());
        return new ErrorMessageDTO("categoryData.error.badRequest");
    }

    @ExceptionHandler(Exception.class)
    @ResponseBody
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public ErrorMessageDTO handleUnknownException(Exception e) {
        log.warn(e.getMessage());
        return new ErrorMessageDTO("categoryData.error.unknownError");
    }

}