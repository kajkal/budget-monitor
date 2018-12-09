package budget_monitor.dto.output;

public class ErrorMessageDTO {

    private String message;


    public ErrorMessageDTO(String message) {
        this.message = message;
    }

    public String getMessage() {
        return message;
    }

}
