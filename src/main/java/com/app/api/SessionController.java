package com.app.api;

import io.swagger.annotations.*;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import java.util.*;
import javax.servlet.*;
import javax.servlet.http.*;

import com.app.repo.*;
import com.app.model.*;
import com.app.model.session.*;
import com.app.model.response.*;
import com.app.model.user.*;
import static com.app.model.response.OperationResponse.*;

/*
This is a dummy rest controller, for the purpose of documentation (/session) path is map to a filter
 - This will only be invoked if security is disabled
 - If Security is enabled then SessionFilter.java is invoked
 - Enabling and Disabling Security is done at config/applicaton.properties 'security.ignored=/**'
*/

@RestController
@Api(tags = {"Authentication"})
public class SessionController {

    @Autowired
    private UserRepo userRepo;

    @ApiResponses(value = { @ApiResponse(code = 200, message = "Will return a security token, which must be passed in every request", response = SessionResponse.class) })
    @RequestMapping(value = "/session", method = RequestMethod.POST, consumes = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public SessionResponse newSession(@RequestBody Login login, HttpServletRequest request, HttpServletResponse response) {
        User user = userRepo.findOneByUserIdAndPassword(login.getUsername(), login.getPassword()).orElse(null);
        SessionResponse resp = new SessionResponse();
        SessionItem sessionItem = new SessionItem();
        if (user != null){
            sessionItem.setToken("xxx.xxx.xxx");
            sessionItem.setUserId(user.getUserId());
            sessionItem.setFirstName(user.getFirstName());
            sessionItem.setLastName(user.getLastName());
            sessionItem.setEmail(user.getEmail());
            //sessionItem.setRole(user.getRole());

            resp.setOperationStatus(ResponseStatusEnum.SUCCESS);
            resp.setOperationMessage("Dummy Login Success");
            resp.setItem(sessionItem);
      }
      else{
            resp.setOperationStatus(ResponseStatusEnum.ERROR);
            resp.setOperationMessage("Login Failed");
      }
      return resp;
  }

    @RequestMapping(value = "/session/user", method = RequestMethod.GET, produces = {"application/json"})
    @ResponseBody
    public UserResponse getUserInformation(@RequestParam(value = "name", required = false) String userIdParam, HttpServletRequest req) {
        User user = userRepo.findOneByUserId(userIdParam).orElse(null);
        UserResponse resp = new UserResponse();
        resp.setData(user);
        System.out.println(user);
        System.out.println(resp);
        return resp;
    }

}
