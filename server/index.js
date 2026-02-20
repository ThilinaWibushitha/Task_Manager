const express = require('express');
const cors = require('cors');
const db = require('./db');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// --- EMAIL SETUP ---
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true', // true for 465, false for 587
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD
    }
});

const PM_EMAIL = process.env.PM_EMAIL || 'thilina.wibushitha@gmail.com';
const HR_EMAIL = process.env.HR_EMAIL || 'asnitthilina@gmail.com';

// Send email to PM when employee submits a task
async function notifyPMNewTask(taskData) {
    try {
        const timeStr = taskData.timeSpent ? `${taskData.timeSpent} hours` : 'N/A';
        await transporter.sendMail({
            from: `"Task Manager" <${process.env.EMAIL_USER}>`,
            to: PM_EMAIL,
            subject: `📋 New Task Submitted - ${taskData.project}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <div style="background: linear-gradient(135deg, #0d9488, #14b8a6); padding: 20px; border-radius: 12px 12px 0 0;">
                        <h2 style="color: white; margin: 0;">📋 New Task Submitted</h2>
                    </div>
                    <div style="background: #f8fafc; padding: 20px; border: 1px solid #e2e8f0; border-radius: 0 0 12px 12px;">
                        <table style="width: 100%; border-collapse: collapse;">
                            <tr><td style="padding: 8px 0; color: #64748b; font-weight: 600;">Employee:</td><td style="padding: 8px 0;">${taskData.name}</td></tr>
                            <tr><td style="padding: 8px 0; color: #64748b; font-weight: 600;">Project:</td><td style="padding: 8px 0;">${taskData.project}</td></tr>
                            <tr><td style="padding: 8px 0; color: #64748b; font-weight: 600;">Task:</td><td style="padding: 8px 0;">${taskData.assigned || 'N/A'}</td></tr>
                            <tr><td style="padding: 8px 0; color: #64748b; font-weight: 600;">Time Spent:</td><td style="padding: 8px 0;">${timeStr}</td></tr>
                            <tr><td style="padding: 8px 0; color: #64748b; font-weight: 600;">Status:</td><td style="padding: 8px 0;">${taskData.completed ? '✅ Completed' : '⏳ Pending'}</td></tr>
                            ${taskData.pending ? `<tr><td style="padding: 8px 0; color: #64748b; font-weight: 600;">Pending Reason:</td><td style="padding: 8px 0; color: #d97706;">${taskData.pending}</td></tr>` : ''}
                            ${taskData.deadline ? `<tr><td style="padding: 8px 0; color: #64748b; font-weight: 600;">Deadline:</td><td style="padding: 8px 0;">${taskData.deadline}</td></tr>` : ''}
                        </table>
                        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 16px 0;">
                        <p style="color: #94a3b8; font-size: 12px; margin: 0;">This task needs your approval. Please review it in the Task Manager dashboard.</p>
                    </div>
                </div>
            `
        });
        console.log('✉️ PM notification email sent');
    } catch (err) {
        console.error('❌ Failed to send PM email:', err.message);
    }
}

// Send email to HR when PM approves a task
async function notifyHRApproval(taskData, approverName) {
    try {
        await transporter.sendMail({
            from: `"Task Manager" <${process.env.EMAIL_USER}>`,
            to: HR_EMAIL,
            subject: `✅ Task Approved - ${taskData.project}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <div style="background: linear-gradient(135deg, #059669, #10b981); padding: 20px; border-radius: 12px 12px 0 0;">
                        <h2 style="color: white; margin: 0;">✅ Task Approved</h2>
                    </div>
                    <div style="background: #f8fafc; padding: 20px; border: 1px solid #e2e8f0; border-radius: 0 0 12px 12px;">
                        <table style="width: 100%; border-collapse: collapse;">
                            <tr><td style="padding: 8px 0; color: #64748b; font-weight: 600;">Employee:</td><td style="padding: 8px 0;">${taskData.name}</td></tr>
                            <tr><td style="padding: 8px 0; color: #64748b; font-weight: 600;">Project:</td><td style="padding: 8px 0;">${taskData.project}</td></tr>
                            <tr><td style="padding: 8px 0; color: #64748b; font-weight: 600;">Task:</td><td style="padding: 8px 0;">${taskData.assigned || 'N/A'}</td></tr>
                            <tr><td style="padding: 8px 0; color: #64748b; font-weight: 600;">Time Spent:</td><td style="padding: 8px 0;">${taskData.time_spent || 'N/A'} hours</td></tr>
                            <tr><td style="padding: 8px 0; color: #64748b; font-weight: 600;">Approved By:</td><td style="padding: 8px 0; color: #059669; font-weight: 600;">✅ ${approverName}</td></tr>
                        </table>
                        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 16px 0;">
                        <p style="color: #94a3b8; font-size: 12px; margin: 0;">This task has been approved and recorded.</p>
                    </div>
                </div>
            `
        });
        console.log('✉️ HR notification email sent');
    } catch (err) {
        console.error('❌ Failed to send HR email:', err.message);
    }
}

// Routes

// --- AUTH ---
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        if (result.rows.length > 0) {
            const user = result.rows[0];
            if (user.password === password) { // Plaintext for now as per legacy
                // Return user object without password
                const { password, ...userWithoutPass } = user;
                // rename emp_id to id for frontend compatibility
                userWithoutPass.id = user.emp_id;
                res.json({ valid: true, ...userWithoutPass });
            } else {
                res.json({ valid: false, message: 'Invalid Password' });
            }
        } else {
            res.json({ valid: false, message: 'User not found' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: 'error', message: 'Database Error' });
    }
});

// --- EMPLOYEES ---
app.post('/api/employees', async (req, res) => {
    const { id, name, email, password, role, dept } = req.body;
    try {
        // ID is mapped to emp_id
        await db.query(
            'INSERT INTO users (emp_id, name, email, password, role, dept) VALUES ($1, $2, $3, $4, $5, $6)',
            [id, name, email, password, role || 'EMPLOYEE', dept || 'General']
        );
        res.json({ status: 'success', message: 'Employee Registered' });
    } catch (err) {
        console.error(err);
        res.json({ status: 'error', message: err.detail || 'Registration Failed' });
    }
});

// --- TASKS ---
app.get('/api/tasks', async (req, res) => {
    const { userId, role } = req.query;
    try {
        let query = 'SELECT * FROM tasks';
        let params = [];

        if (role === 'EMPLOYEE') {
            query += ' WHERE emp_id = $1';
            params.push(userId);
        }
        // ADMIN and PM see all tasks

        query += ' ORDER BY created_at DESC';

        const result = await db.query(query, params);

        // Map keys to frontend expectation if needed (snake_case from DB to compatible format)
        // Frontend expects: empId, name, project, deadline, date, assigned, completed, time, pending, signature
        const tasks = result.rows.map(row => ({
            rowIndex: row.id, // Use DB ID as rowIndex
            empId: row.emp_id,
            name: row.name,
            project: row.project,
            deadline: row.deadline, // stored as string/date
            date: row.date ? new Date(row.date).toLocaleDateString() : '',
            assigned: row.assigned,
            completed: row.completed,
            timeSpent: row.time_spent,
            pending: row.pending,
            signature: row.signature || 'Pending',
            parentId: row.parent_id // Return parent ID
        }));

        res.json(tasks);
    } catch (err) {
        console.error(err);
        res.json([]);
    }
});

app.post('/api/tasks', async (req, res) => {
    const { empId, name, project, deadline, date, assigned, completed, timeSpent, pending, linkedTaskId } = req.body;

    try {
        await db.query('BEGIN'); // Start Transaction

        // 1. Insert New Task
        await db.query(
            `INSERT INTO tasks (emp_id, name, project, deadline, date, assigned, completed, time_spent, pending, parent_id)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
            [empId, name || '', project || '', deadline || '', date || new Date(), assigned || '', completed || '', timeSpent || '', pending || '', linkedTaskId || null]
        );

        // 2. If Linked Task exists, update it to mark as Resolved (but keep history)
        if (linkedTaskId) {
            await db.query(
                `UPDATE tasks 
                 SET completed = COALESCE(completed, '') || ' (Continued in new task)',
                     signature = 'Resolved'
                 WHERE id = $1`,
                [linkedTaskId]
            );
        }

        await db.query('COMMIT'); // Commit Transaction

        // Send email to PM (async, don't block response)
        notifyPMNewTask({ name: name || '', project: project || '', assigned: assigned || '', timeSpent: timeSpent || '', completed: completed || '', pending: pending || '', deadline: deadline || '' });

        res.json({ status: 'success', message: 'Task Added' });
    } catch (err) {
        await db.query('ROLLBACK'); // Rollback on error
        console.error(err);
        res.json({ status: 'error', message: 'Failed to add task' });
    }
});

app.post('/api/approve', async (req, res) => {
    const { rowIndex, signature } = req.body; // rowIndex here is the DB ID
    try {
        await db.query(
            'UPDATE tasks SET signature = $1 WHERE id = $2',
            [signature, rowIndex]
        );

        // Fetch task details and send email to HR
        const taskResult = await db.query('SELECT * FROM tasks WHERE id = $1', [rowIndex]);
        if (taskResult.rows.length > 0) {
            notifyHRApproval(taskResult.rows[0], signature);
        }

        res.json({ status: 'success', message: 'Task Approved' });
    } catch (err) {
        console.error(err);
        res.json({ status: 'error', message: 'Approval Failed' });
    }
});

// --- DELETE TASK ---
app.delete('/api/tasks/:id', async (req, res) => {
    const taskId = req.params.id;
    const { empId } = req.body;
    try {
        // Only allow owner to delete
        const result = await db.query('DELETE FROM tasks WHERE id = $1 AND emp_id = $2', [taskId, empId]);
        if (result.rowCount > 0) {
            res.json({ status: 'success', message: 'Task Deleted' });
        } else {
            res.json({ status: 'error', message: 'Task not found or not authorized' });
        }
    } catch (err) {
        console.error(err);
        res.json({ status: 'error', message: 'Delete Failed' });
    }
});

app.get('/api/stats', async (req, res) => {
    // Basic stats implementation
    res.json({
        totalTasks: 0,
        completedTasks: 0,
        pendingTasks: 0,
        // ... expand as needed
    });
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
