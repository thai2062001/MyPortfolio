-- Insert Metrics data into Supabase
INSERT INTO metrics (value, label_en, label_ja, color, order_index, is_published, created_at, updated_at) VALUES
(
'150%',
'Average Revenue Increase',
'平均売上増加率',
'text-sage',
0,
true,
NOW(),
NOW()
),
(
'45M+',
'Marketing Revenue Generated',
'マーケティング創出収益',
'text-gold',
1,
true,
NOW(),
NOW()
),
(
'4.2x',
'Average Campaign ROAS',
'平均キャンペーンROAS',
'text-sage',
2,
true,
NOW(),
NOW()
),
(
'280%',
'Organic Traffic Growth',
'オーガニックトラフィック成長',
'text-gold',
3,
true,
NOW(),
NOW()
);
