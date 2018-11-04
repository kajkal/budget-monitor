package budget_monitor.dto.output;

public class ErrorMessageDTO {

    private String messageKey;


    public ErrorMessageDTO(String messageKey) {
        this.messageKey = messageKey;
    }

    public String getMessageKey() {
        return messageKey;
    }

}
