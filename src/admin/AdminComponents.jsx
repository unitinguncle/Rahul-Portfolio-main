// Reusable styles for admin panel
export const adminCard = {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 14,
    padding: '24px',
    marginBottom: 20,
};

export const adminBtn = {
    padding: '8px 16px',
    borderRadius: 8,
    border: 'none',
    cursor: 'pointer',
    fontWeight: 600,
    fontSize: 13,
    transition: 'all 0.2s',
};

export const primaryBtn = {
    ...adminBtn,
    background: 'linear-gradient(90deg, #00b4ff, #0072ff)',
    color: '#fff',
};

export const dangerBtn = {
    ...adminBtn,
    background: 'rgba(255,60,60,0.15)',
    color: '#ff6b6b',
    border: '1px solid rgba(255,60,60,0.3)',
};

export const secondaryBtn = {
    ...adminBtn,
    background: 'rgba(255,255,255,0.08)',
    color: '#ccc',
    border: '1px solid rgba(255,255,255,0.1)',
};

export const inputStyle = {
    width: '100%',
    padding: '10px 12px',
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 8,
    color: '#fff',
    fontSize: 14,
    outline: 'none',
    boxSizing: 'border-box',
};

export const labelStyle = {
    display: 'block',
    color: '#aaa',
    fontSize: 13,
    marginBottom: 5,
    fontWeight: 500,
};

export const pageHeader = {
    fontSize: 24,
    fontWeight: 700,
    color: '#00b4ff',
    marginBottom: 6,
};

export const pageSubtitle = {
    color: '#888',
    fontSize: 14,
    marginBottom: 28,
};

export function AdminPageHeader({ title, subtitle, action }) {
    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
            <div>
                <h1 style={pageHeader}>{title}</h1>
                {subtitle && <p style={pageSubtitle}>{subtitle}</p>}
            </div>
            {action}
        </div>
    );
}

export function StatusMsg({ msg, isError }) {
    if (!msg) return null;
    return (
        <div style={{
            padding: '10px 14px', borderRadius: 8, fontSize: 13, marginTop: 12,
            background: isError ? 'rgba(255,60,60,0.1)' : 'rgba(0,255,160,0.1)',
            border: `1px solid ${isError ? 'rgba(255,60,60,0.3)' : 'rgba(0,255,160,0.3)'}`,
            color: isError ? '#ff8888' : '#0ffa9a',
        }}>
            {msg}
        </div>
    );
}
