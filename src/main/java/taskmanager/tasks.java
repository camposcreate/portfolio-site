package taskmanager;

public class tasks {
	// private attributes
	private String title;
	private boolean priority;
	private int id;

	// set and get title
	public void setTitle(String title) {
		this.title = title;
	}
	public String getTitle() {
		return title;
	}

	// set and get priority
	public void setPriority(boolean priority) {
		this.priority = priority;
	}
	public boolean isPriority() {
		return priority;
	}

	// set and get id
	public void setId(int id) {this.id = id;}
	public int getId() {return id;}

} // end class tasks()
