# RoundReady - Interview Practice Tracker

A React + LocalStorage machine-coding project for Weekly Interview Preparation Sheet 01.

## Features
- Dashboard: total questions, completed DSA, completed interview questions, machine-coding status
- Complete CRUD for practice questions
- DSA / Git / Technical categories
- Easy / Medium / Hard difficulty
- Pending / In Progress / Completed status
- Search and combined filters
- Overall and per-track progress
- LocalStorage persistence
- Responsive desktop/mobile UI
- Empty/no-results state
- Form validation
- 15 starter questions from Sheet 01

## Run
```bash
npm install
npm run dev
```

## Production check
```bash
npm run build
```

## Data flow
`App.jsx` owns the questions and machine-coding state. Dashboard metrics and progress are derived from the question array. Every state change is persisted to LocalStorage, so refresh does not lose progress.

## CRUD
- Create: Add question drawer
- Read: Question bank
- Update: Edit drawer + quick status cycle
- Delete: Delete action with confirmation
