# 🚀 SprintDesk

SprintDesk is a smart issue tracking board built using **React**, **Firebase**, and **Vite**.  
It helps teams create, manage, and track issues with clear workflow rules and real-time updates.

---



Que 1. Why did you choose the frontend stack you used?

I chose this frontend stack because it is simple, modern, and well-suited for building real-world applications. React helps in creating reusable components and managing UI state efficiently, which makes the code easier to understand and maintain. Vite provides a fast development experience with quick builds and hot reloading, allowing me to iterate faster during development. Firebase integrates smoothly with the frontend, handling authentication and database needs without extra backend setup. Overall, this stack allowed me to focus more on solving the problem and implementing business logic rather than spending time on complex configurations.


Que 2. Explain your Firestore data structure

I designed the Firestore data structure to be simple, clear, and easy to scale. The application mainly uses an **issues** collection, where each document represents a single issue. Every issue document stores fields such as title, description, priority, status, assignedTo, createdBy, and createdAt. This flat structure makes it easy to fetch, filter, and sort issues efficiently, especially by status and priority. Storing timestamps allows issues to be displayed in newest-first order. The structure avoids unnecessary nesting, which improves query performance and keeps the data easy to understand and maintain.



Que 3. Explain how you handled similar issues

I handled similar issues by checking existing issue titles when a new issue is created. If a similar title is found in Firestore, the application shows a warning with the related issue titles. The user is then asked to confirm whether they still want to create the issue. This approach helps reduce duplicate issues while allowing flexibility when duplicates are actually needed, making the system practical and user-friendly.



Que 4. Mention what was confusing or challenging

One of the most challenging parts of this project was understanding how different tools work together, especially Firebase Authentication, Firestore rules, and deployment on Vercel. Handling Git conflicts and knowing how to resolve them during rebasing was also confusing at first. Another challenge was implementing business rules like status transitions and duplicate issue detection without over-engineering the logic. Debugging environment variables and configuring authorized domains for Firebase on deployment took some trial and error. Overall, these challenges helped me better understand real-world development workflows and problem-solving.


Que 5. Mention what you would improve next

Next, I would improve the project by adding better user feedback, such as loading indicators and success messages instead of alerts. I would also enhance role-based access, allowing only certain users to update or close issues. Adding an archive section for completed issues and improving search functionality would make the application more scalable. Finally, I would focus on improving UI responsiveness and adding automated tests to ensure reliability as the project grows.

