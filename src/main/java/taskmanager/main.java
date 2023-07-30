package taskmanager;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/tasks")
@CrossOrigin(origins = "http://localhost:8080")
public class main {

	private List<tasks> taskObject = new ArrayList<>();

	@PostMapping("/addTask")
	public ResponseEntity<String> addTask(@RequestBody tasks object) {
		if (object.isPriority() && taskObject.isEmpty()) {
			taskObject.add(object);
		} else if (object.isPriority()) {
			taskObject.add(0, object);
		} else {
			taskObject.add(object);
		}
		return ResponseEntity.ok("{\"message\": \"Task added successfully\"}");
	}

	@GetMapping("/getTasks")
	public List<tasks> getAllTasks() {
		return taskObject;
	}

	@DeleteMapping("/{index}")
	public void deleteTask(@PathVariable int index) {
		if (index >= 0 && index < taskObject.size()) {
			taskObject.remove(index);
		}
	}

	@DeleteMapping
	public void clearAllTasks() {
		taskObject.clear();
		System.out.println("All tasks cleared.");
	}
}
