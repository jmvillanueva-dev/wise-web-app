import { useTheme } from "../../ThemeContext";

const Sidebar = () => {
    const { darkMode } = useTheme();
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    const calendarDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    const suggestedUsers = [
        { id: 1, name: "Alice Johnson" },
        { id: 2, name: "Bob Smith" },
        { id: 3, name: "Carol Williams" },
        { id: 4, name: "David Brown" },
        { id: 5, name: "Eva Davis" },
    ];

    return (
        <aside className={`sidebar ${darkMode ? "dark-mode" : ""}`}>
            <div className="calendar">
                <div className="calendar-header">
                    <h3>
                        {currentDate.toLocaleString("default", { month: "long" })} {currentYear}
                    </h3>
                </div>
                <div className="calendar-grid">
                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                        <div key={day} className="calendar-day">
                            {day}
                        </div>
                    ))}
                    {calendarDays.map((day) => (
                        <div key={day} className={`calendar-day ${day === currentDate.getDate() ? "today" : ""}`}>
                            {day}
                        </div>
                    ))}
                </div>
            </div>
            <div className="suggested-users">
                <h3>Suggested Users</h3>
                {suggestedUsers.map((user) => (
                    <div key={user.id} className="suggested-user">
                        <div className="suggested-user-avatar">
                            {/* Ícono genérico de usuario */}
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                <circle cx="12" cy="7" r="4"></circle>
                            </svg>
                        </div>
                        <div className="suggested-user-info">
                            <span className="suggested-user-name">{user.name}</span>
                            <button className="follow-button">Follow</button>
                        </div>
                    </div>
                ))}
            </div>
        </aside>
    );
};

export default Sidebar;