package taskmanager;

import java.util.ArrayList;
import java.util.Scanner;

public class tasks {
	// private attributes
	private String title;
	private boolean priority;

	// set title
	public void setTitle(String title) {
		this.title = title;
	}
	// get title
	public String getTitle() {
		return title;
	}
	// set priority
	public void setPriority(boolean priority) {
		this.priority = priority;
	}
	// get priority
	public boolean isPriority() {
		return priority;
	}

} // end class tasks()
