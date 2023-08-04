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
	private int taskId = 0; // unique id for given task

	@PostMapping("/addTask")
	public ResponseEntity<String> addTask(@RequestBody tasks object) {
		object.setId(taskId++);
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

	@DeleteMapping("/deleteSelected")
	public void deleteTask(@RequestBody List<Integer> ids) {
		List<tasks> tasksToDelete = new ArrayList<>();

		for (int id : ids) {
			tasks taskToDelete = taskObject.stream()
					.filter(task -> task.getId() == id)
					.findFirst()
					.orElse(null);

			if (taskToDelete != null) {
				tasksToDelete.add(taskToDelete);
			}
		}
		taskObject.removeAll(tasksToDelete);
	}


	@DeleteMapping
	public void clearAllTasks() {
		taskObject.clear();
		System.out.println("All tasks cleared.");
	}
}
