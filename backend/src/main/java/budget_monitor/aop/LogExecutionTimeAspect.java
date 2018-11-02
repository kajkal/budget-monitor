package budget_monitor.aop;

import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Aspect
@Component
public class LogExecutionTimeAspect {

    private final Logger log = LoggerFactory.getLogger(getClass());

    @Around("@annotation(LogExecutionTime)")
    public Object logExecutionTime(ProceedingJoinPoint joinPoint) throws Throwable {
        final long start = System.currentTimeMillis();

        final Object proceed = joinPoint.proceed();

        final long executionTime = System.currentTimeMillis() - start;

        log.info(String.format("%s executed in %d ms", joinPoint.getSignature().toShortString(), executionTime));

        return proceed;
    }

}
