import { useEffect, useState } from 'react';
import './App.css';

const API_URL = 'http://localhost:3001';

function App() {
  const [jobs, setJobs] = useState([]);

  const [title, setTitle] = useState('');
  const [type, setType] = useState('');

  const [showForm, setShowForm] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [creating, setCreating] = useState(false);

  // =========================
  // GET ALL JOBS
  // =========================
  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await fetch(`${API_URL}/jobs`);

      if (!response.ok) {
        throw new Error('Failed to fetch jobs');
      }

      const data = await response.json();
      setJobs(data);
    } catch (error) {
      console.error(error);
      setError('Unable to load jobs. Please check your backend.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(fetchJobs, 0);

    return () => clearTimeout(timeoutId);
  }, []);

  // =========================
  // COUNTS
  // =========================
  const totalJobs = jobs.length;

  const pendingJobs = jobs.filter(
    (job) => job.status === 'pending'
  ).length;

  const runningJobs = jobs.filter(
    (job) => job.status === 'running'
  ).length;

  const completedJobs = jobs.filter(
    (job) => job.status === 'completed'
  ).length;

  const failedJobs = jobs.filter(
    (job) => job.status === 'failed'
  ).length;

  // =========================
  // FILTER JOBS
  // =========================
  const filteredJobs =
    filterStatus === 'all'
      ? jobs
      : jobs.filter((job) => job.status === filterStatus);

  // =========================
  // CREATE JOB
  // =========================
  const createJob = async (event) => {
    event.preventDefault();

    if (!title.trim() || !type.trim()) {
      alert('Please enter both title and type.');
      return;
    }

    try {
      setCreating(true);

      const response = await fetch(`${API_URL}/jobs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: title.trim(),
          type: type.trim(),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || 'Failed to create job'
        );
      }

      const newJob = await response.json();

      setJobs((previousJobs) => [
        newJob,
        ...previousJobs,
      ]);

      setTitle('');
      setType('');
      setShowForm(false);
      setError('');
    } catch (error) {
      console.error(error);
      alert(error.message);
    } finally {
      setCreating(false);
    }
  };

  // =========================
  // UPDATE STATUS
  // =========================
  const updateJobStatus = async (id, status) => {
    try {
      setError('');

      const response = await fetch(
        `${API_URL}/jobs/${id}/status`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            Status: status,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();

        throw new Error(
          errorData.message ||
            'Failed to update job status'
        );
      }

      const updatedJob = await response.json();

      setJobs((previousJobs) =>
        previousJobs.map((job) =>
          job.id === updatedJob.id ? updatedJob : job
        )
      );
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  // =========================
  // DELETE JOB
  // =========================
  const deleteJob = async (id) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this job?'
    );

    if (!confirmed) {
      return;
    }

    try {
      setError('');

      const response = await fetch(
        `${API_URL}/jobs/${id}`,
        {
          method: 'DELETE',
        }
      );

      if (!response.ok) {
        const errorData = await response.json();

        throw new Error(
          errorData.message ||
            'Failed to delete job'
        );
      }

      setJobs((previousJobs) =>
        previousJobs.filter((job) => job.id !== id)
      );
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div>
          <p className="eyebrow">JOB MANAGEMENT</p>
          <h1>Job Queue Dashboard</h1>
          <p className="subtitle">
            Create, track and manage your jobs in one place.
          </p>
        </div>

        <button
          className="primary-btn"
          onClick={() => setShowForm(true)}
        >
          + Create New Job
        </button>
      </header>

      {/* Error */}
      {error && (
        <div className="error-banner">
          {error}
        </div>
      )}

      {/* Create Form */}
      {showForm && (
        <div className="form-card">
          <div className="form-header">
            <div>
              <h2>Create New Job</h2>
              <p>
                Add a new job to the queue.
              </p>
            </div>

            <button
              className="close-btn"
              onClick={() => {
                setShowForm(false);
                setTitle('');
                setType('');
              }}
            >
              ×
            </button>
          </div>

          <form onSubmit={createJob}>
            <div className="form-grid">
              <div className="input-group">
                <label>Job Title</label>

                <input
                  type="text"
                  placeholder="e.g. Send welcome email"
                  value={title}
                  onChange={(event) =>
                    setTitle(event.target.value)
                  }
                />
              </div>

              <div className="input-group">
                <label>Job Type</label>

                <input
                  type="text"
                  placeholder="e.g. email"
                  value={type}
                  onChange={(event) =>
                    setType(event.target.value)
                  }
                />
              </div>
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="secondary-btn"
                onClick={() => {
                  setShowForm(false);
                  setTitle('');
                  setType('');
                }}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="primary-btn"
                disabled={creating}
              >
                {creating
                  ? 'Creating...'
                  : 'Create Job'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Stats */}
      <section className="stats-grid">
        <div className="stat-card">
          <p>Total Jobs</p>
          <h3>{totalJobs}</h3>
        </div>

        <div className="stat-card">
          <p>Pending</p>
          <h3>{pendingJobs}</h3>
        </div>

        <div className="stat-card">
          <p>Running</p>
          <h3>{runningJobs}</h3>
        </div>

        <div className="stat-card">
          <p>Completed</p>
          <h3>{completedJobs}</h3>
        </div>

        <div className="stat-card">
          <p>Failed</p>
          <h3>{failedJobs}</h3>
        </div>
      </section>

      {/* Jobs Section */}
      <section className="jobs-card">
        <div className="jobs-header">
          <div>
            <h2>Jobs</h2>
            <p>
              Manage and monitor all your jobs.
            </p>
          </div>

          <div className="filter-box">
            <label>Filter</label>

            <select
              value={filterStatus}
              onChange={(event) =>
                setFilterStatus(event.target.value)
              }
            >
              <option value="all">All Jobs</option>
              <option value="pending">Pending</option>
              <option value="running">Running</option>
              <option value="completed">
                Completed
              </option>
              <option value="failed">Failed</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="state-box">
            <div className="loader"></div>
            <p>Loading jobs...</p>
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="empty-state">
            <h3>No jobs found</h3>
            <p>
              Create a job or change the selected filter.
            </p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Title</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Created At</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredJobs.map((job) => (
                  <tr key={job.id}>
                    <td className="id-cell">
                      #{job.id}
                    </td>

                    <td className="title-cell">
                      {job.title}
                    </td>

                    <td>{job.type}</td>

                    <td>
                      <span
                        className={`status-badge ${job.status}`}
                      >
                        {job.status}
                      </span>
                    </td>

                    <td>
                      {new Date(
                        job.createdAt
                      ).toLocaleString()}
                    </td>

                    <td>
                      <div className="action-buttons">
                        {job.status === 'pending' && (
                          <button
                            className="run-btn"
                            onClick={() =>
                              updateJobStatus(
                                job.id,
                                'running'
                              )
                            }
                          >
                            Run
                          </button>
                        )}

                        {job.status === 'running' && (
                          <>
                            <button
                              className="complete-btn"
                              onClick={() =>
                                updateJobStatus(
                                  job.id,
                                  'completed'
                                )
                              }
                            >
                              Complete
                            </button>

                            <button
                              className="fail-btn"
                              onClick={() =>
                                updateJobStatus(
                                  job.id,
                                  'failed'
                                )
                              }
                            >
                              Fail
                            </button>
                          </>
                        )}

                        <button
                          className="delete-btn"
                          onClick={() =>
                            deleteJob(job.id)
                          }
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

export default App;