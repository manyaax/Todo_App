'use client';

import { useState, useEffect } from 'react';
import type { CSSProperties } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useSession } from "next-auth/react";
type Todo = {
  id: string;
  text: string;
  date: string;
  time?: string;
  completed: boolean;
};

export default function Page() {
  const [userInput, setUserInput] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [list, setList] = useState<Todo[]>([]);
  const [editIndex, setEditIndex] = useState<number | null>(null);
const [calendarKey, setCalendarKey] = useState(0);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showCalendar, setShowCalendar] = useState(false);
  useEffect(() => {
  fetchTodos();
}, []);

const { data: session } = useSession();
const fetchTodos = async () => {
  try {
    const res = await fetch("/api/todos", {
  credentials: "include",
});

    const data = await res.json();

    if (Array.isArray(data)) {

  const formatted = data.map((t: any) => ({
    id: t._id,          // ⭐ convert Mongo _id → frontend id
    text: t.text,
    date: t.date,
    time: t.time,
    completed: t.completed,
  }));

  setList(formatted);

} else {
  console.error("API Error:", data);
  setList([]);
}

  } catch (error) {
    console.error("Fetch failed:", error);
    setList([]);
  }
};

  useEffect(() => {
  setCalendarKey(prev => prev + 1);
}, [list]);

  
 const formatDate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};
const formatDateForDisplay = (dateStr: string) => {
  const [year, month, day] = dateStr.split('-');
  return `${day}-${month}-${year}`;
};
const selectedDateStr = formatDate(selectedDate);

const todosForSelectedDate = list.filter(
  (todo) => !selectedDateStr || todo.date === selectedDateStr
);


const completedCount = todosForSelectedDate.filter(
  (t) => t.completed
).length;
const totalCount = todosForSelectedDate.length;

const formatTime = (time: string) => {
  const [hour, minute] = time.split(':').map(Number);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const h = hour % 12 || 12;
  return `${h}:${minute.toString().padStart(2, '0')} ${ampm}`;
};
const isOverdue = (item: Todo) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const taskDate = new Date(item.date);
  taskDate.setHours(0, 0, 0, 0);

  return !item.completed && taskDate < today;
};
const toggleComplete = async (todo: Todo) => {
  await fetch("/api/todos", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      id: todo.id,
      completed: !todo.completed,
    }),
  });

  fetchTodos();
};

const handleAction = async () => {
  if (!userInput.trim()) return;

  const finalDate = date || formatDate(selectedDate);

  if (editIndex !== null) {
    const todo = list[editIndex];

    await fetch("/api/todos", {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: todo.id,
        text: userInput,
        date: finalDate,
        time,
      }),
    });
  } else {
    await fetch("/api/todos", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text: userInput,
        date: finalDate,
        time,
      }),
    });
  }

  setUserInput("");
  setDate("");
  setTime("");
  setEditIndex(null);

  fetchTodos(); // refresh
};


const handleEdit = (index: number) => {
  const todo = list[index];
  setUserInput(todo.text);
  setDate(todo.date);
  setTime(todo.time ?? '');
  setEditIndex(index);
  setSelectedDate(new Date(todo.date));
};

const handleDelete = async (id: string) => {
  await fetch("/api/todos", {
    method: "DELETE",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id }),
  });

  fetchTodos();
};


  return (
    <main style={styles.page}>
      <div style={styles.card}>
<div style={{ textAlign: "center", marginBottom: 14 }}>
  <div style={{ fontSize: 14, color: "#000000" }}>
    Hi,{" "}
    <span style={{ fontWeight: 600, color: "#111827" }}>
      {session?.user?.name}
    </span>{" "}
    👋
  </div>

  <div
    style={{
      marginTop: 8,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      gap: 8,
    }}
  >
    <span style={{ fontSize: 20 }}>🌸</span>
    <h1
      style={{
        margin: 0,
        fontSize: 16,
        fontWeight: 600,
        color: "#111827",
      }}
    >
      My Todo List
    </h1>
  </div>
</div>

        {/* INPUT ROW */}
        <div style={{ ...styles.inputRow, position: 'relative' }}>
          <input
            style={styles.input}
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="✨ Add something ..."
          />

          {/* DATE + CALENDAR ICON */}
          <div style={styles.dateWrapper}>
            <input
              type="date"
              style={styles.dateInput}
              value={date}
              readOnly
            />
            <button
              style={styles.calendarBtn}
              onClick={() => setShowCalendar(!showCalendar)}
            >
              📅
            </button>
          </div>

          <input
            type="time"
            style={styles.timeInput}
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />

          <button style={styles.addBtn} onClick={handleAction}>
            {editIndex !== null ? '💾' : '➕'}
          </button>

          {/* CALENDAR POPUP */}
          {showCalendar && (
            <div style={styles.calendarPopup}>
            <Calendar
  key={calendarKey}
  onChange={(value) => {
  if (!value || Array.isArray(value)) return;

  setSelectedDate(value);
  setDate(formatDate(value));  
  setShowCalendar(false);     
}}

  value={selectedDate}
  tileClassName={({ date, view }) => {
    if (view !== 'month') return null;

    const hasTodo = list.some(todo => {
      const [dd, mm, yyyy] = todo.date.split('-').map(Number);
      return (
        date.getDate() === dd &&
        date.getMonth() === mm - 1 &&
        date.getFullYear() === yyyy
      );
    });

    return hasTodo ? 'has-todo' : null;
  }}
/>
            </div>
          )}
        </div>
        <h3 style={{ fontSize: 14, marginBottom: 6 }}>
  📅 Tasks for {formatDateForDisplay(selectedDateStr)}
</h3>

<p style={{ fontSize: 12, marginBottom: 10 }}>
  ✅ {completedCount} / {totalCount} completed
</p>

        {/* TODO LIST */}
        <ul style={styles.list}>
          {todosForSelectedDate.map((item, index) => (
  <li
    key={index}
    style={{
      ...styles.listItem,
      border: isOverdue(item) ? '2px solid #ef4444' : 'none',
      background: item.completed
        ? '#ecfdf5'
        : isOverdue(item)
        ? '#fee2e2'
        : '#fdf2f8',
      opacity: item.completed ? 0.7 : 1,
    }}
  >
    <div style={{ display: 'flex', gap: 8 }}>
    <input
  type="checkbox"
  checked={item.completed}
  onChange={() => toggleComplete(item)}
/>

      <div>
        <span
          style={{
            textDecoration: item.completed ? 'line-through' : 'none',
            color: item.completed ? '#16a34a' : '#000',
          }}
        >
          {item.text}
        </span>

        <div style={styles.meta}>
          📅 {formatDateForDisplay(item.date)}
          {item.time && <> ⏰ {formatTime(item.time)}</>}
        </div>
      </div>
    </div>

    <div>
      <button
  style={styles.editBtn}
  onClick={() => {
    const realIndex = list.findIndex(t => t.id === item.id);
    handleEdit(realIndex);
  }}
>
        ✏️
      </button>
      <button
  style={styles.deleteBtn}
  onClick={() => handleDelete(item.id)}
>
        🗑️
      </button>
    </div>
  </li>
))}
        </ul>
{todosForSelectedDate.length === 0 && (
  <p style={styles.empty}>
    No tasks for this date 🌷
  </p>
)}
      </div>
    </main>
  );
}

const styles: Record<string, CSSProperties> = {
  page: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #fce7f3, #e0f2fe)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'ui-rounded, system-ui',
  },
  card: {
    background: '#fff',
    padding: 24,
    borderRadius: 20,
    width: 350,
    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
  },
  title: {
    textAlign: 'center',
    marginBottom: 16,
  },
  inputRow: {
    display: 'flex',
    gap: 8,
    marginBottom: 16,
    flexWrap: 'wrap',
  },
  input: {
    flex: 1,
    padding: 10,
    borderRadius: 12,
    border: '1px solid #ddd',
    background: '#ffffff',
  color: '#111827',          // ⭐ visible typed text
  outline: 'none',
  },
  dateWrapper: {
    display: 'flex',
    gap: 4,
    alignItems: 'center',
  },
  dateInput: {
    padding: 8,
    borderRadius: 10,
    border: '1px solid #ddd',
    fontSize: 12,
    background: '#ffffff',
  color: '#111827',

  },
  calendarBtn: {
    background: '#fdf2f8',
    border: '1px solid #ddd',
    borderRadius: 10,
    padding: '6px 8px',
    cursor: 'pointer',
    fontSize: 16,
  },
  calendarPopup: {
  position: 'absolute',
  top: 60,
  left: 0,
  zIndex: 10,
  borderRadius: 20,
  overflow: 'hidden',
  boxShadow: '0 15px 40px rgba(0,0,0,0.2)',
  transform: 'scale(1.15)',   // 👈 BIGGER
  transformOrigin: 'top left',
},

  timeInput: {
    padding: 8,
    borderRadius: 10,
    border: '1px solid #ddd',
    fontSize: 12,
    background: '#ffffff',
  color: '#111827',
  },
  addBtn: {
    borderRadius: 12,
    border: 'none',
    background: '#f472b6',
    color: '#fff',
    padding: '0 14px',
    cursor: 'pointer',
    fontSize: 18,
  },
  list: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  listItem: {
    background: '#fdf2f8',
    padding: 10,
    borderRadius: 12,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  meta: {
    fontSize: 12,
    color: '#888',
  },
  editBtn: {
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    marginRight: 6,
  },
  deleteBtn: {
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
  },
  empty: {
    textAlign: 'center',
    color: '#000000',
    marginTop: 12,
  },
};