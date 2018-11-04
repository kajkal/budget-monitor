package budget_monitor.exception.handler;

import budget_monitor.controller.EntryController;
import budget_monitor.dto.output.ErrorMessageDTO;
import budget_monitor.exception.type.EntryException;
import budget_monitor.exception.type.EntryTagException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;

@ControllerAdvice(assignableTypes = EntryController.class)
public class EntryControllerExceptionHandler {

    private final Logger log = LoggerFactory.getLogger(getClass());

    @ExceptionHandler({EntryException.class, EntryTagException.class})
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
        log.warn(e.getMessage());
        return new ErrorMessageDTO("entryData.error.badRequest");
    }

    @ExceptionHandler(Exception.class)
    @ResponseBody
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public ErrorMessageDTO handleUnknownException(Exception e) {
        return new ErrorMessageDTO("entryData.error.unknownError");
    }

}
