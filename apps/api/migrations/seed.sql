-- サンプルデータ
INSERT OR IGNORE INTO users (id, name, email) VALUES (1, 'Alice', 'alice@example.com');
INSERT OR IGNORE INTO users (id, name, email) VALUES (2, 'Bob', 'bob@example.com');

INSERT OR IGNORE INTO shares (id, user_id, title, content) VALUES (1, 1, 'Hello World', '初めての共有です！');
INSERT OR IGNORE INTO shares (id, user_id, title, content) VALUES (2, 2, 'リンク集', '便利なリンクをまとめました');
