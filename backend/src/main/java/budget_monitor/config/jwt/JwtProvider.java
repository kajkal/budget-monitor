package budget_monitor.config.jwt;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.SignatureException;
import io.jsonwebtoken.UnsupportedJwtException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.util.Date;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

@Component("jwtProvider")
public class JwtProvider {

    private final Logger log = LoggerFactory.getLogger(getClass());

    @Value("${security.jwt.token.secret-key}")
    private String jwtSecretKey;

    @Value("${security.jwt.token.expire-after}")
    private long jwtExpireAfter;


    public String generateJwtToken(Authentication authentication) {
        JwtUser user = (JwtUser) authentication.getPrincipal();

        Date issuedAt = new Date();
        Date expireAfter = new Date(issuedAt.getTime() + TimeUnit.MINUTES.toMillis(jwtExpireAfter));

        Claims claims = Jwts.claims().setSubject(user.getUsername());
        claims.put("roles", user.getAuthorities().stream().map(GrantedAuthority::getAuthority).collect(Collectors.joining(",")));
//        if (user.getAuthorities().contains(new SimpleGrantedAuthority("ADMIN"))) {
//            claims.put("isAdmin", true);
//        }
        claims.put("currency", user.getCurrency());

        return Jwts.builder()
                .setClaims(claims)
                .setIssuedAt(issuedAt)
                .setExpiration(expireAfter)
                .signWith(SignatureAlgorithm.HS512, jwtSecretKey)
                .compact();
    }

    public boolean validateJwtToken(String token) {
        try {
            Jwts.parser().setSigningKey(jwtSecretKey).parseClaimsJws(token);
            return true;
        } catch (ExpiredJwtException e) {
            log.warn("Expired JWT token");
        } catch (UnsupportedJwtException e) {
            log.warn("JWT claims does not represent an Claims JWS [" + token + "]");
        } catch (MalformedJwtException e) {
            log.warn("Provided token is not a valid JWS [" + token + "]");
        } catch (SignatureException e) {
            log.warn("JWT signature does not match locally computed signature [" + token + "]");
        } catch (IllegalArgumentException e) {
            log.warn("JWT claims string is empty [" + token + "]");
        }
        return false;
    }

    public String getUsernameFromJwtToken(String token) {
        return Jwts.parser()
                .setSigningKey(jwtSecretKey)
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }

    public String getRolesFromJwtToken(String token) {
        return Jwts.parser()
                .setSigningKey(jwtSecretKey)
                .parseClaimsJws(token)
                .getBody()
                .get("roles")
                .toString();
    }

    public UserDetails getUserDetailsFromJwtToken(String token) {
        Claims claims = Jwts.parser()
                .setSigningKey(jwtSecretKey)
                .parseClaimsJws(token)
                .getBody();

        return User.builder()
                .username(claims.getSubject())
                .password("***")
                .authorities(AuthorityUtils.commaSeparatedStringToAuthorityList(claims.get("roles").toString()))
                .build();
    }

}
