-- Create contact_messages table
CREATE TABLE IF NOT EXISTS contact_messages (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_read BOOLEAN DEFAULT FALSE,
    admin_response TEXT,
    responded_at TIMESTAMP NULL
);

-- Add indexes for better performance
CREATE INDEX idx_contact_messages_created_at ON contact_messages(created_at);
CREATE INDEX idx_contact_messages_is_read ON contact_messages(is_read);
CREATE INDEX idx_contact_messages_email ON contact_messages(email);

-- Insert sample data (optional)
INSERT INTO contact_messages (name, email, subject, message) VALUES
('John Doe', 'john@example.com', 'general', 'Hello, I have a question about pet adoption.'),
('Jane Smith', 'jane@example.com', 'adoption', 'I would like to know more about the adoption process.'),
('Mike Johnson', 'mike@example.com', 'technical', 'I am having trouble with my account login.'); 