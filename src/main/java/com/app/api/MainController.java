package com.app.api;

import org.springframework.stereotype.*;
import org.springframework.web.bind.annotation.*;
import springfox.documentation.annotations.*;

@ApiIgnore
@Controller // Dont use RestController as this method is mapping to a static file not a JSON
public class MainController {

  @RequestMapping(value={"/"})
	public String index() {
		return "index.html";
	}

}
