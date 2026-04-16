-- Insert Work Experiences data into Supabase
INSERT INTO work_experiences (company_name, duration, description_en, description_ja, order_index, is_published, created_at, updated_at) VALUES
(
'GMO Nikko Vietnam',
'2023 - Hiện tại',
'Led advertising campaigns for major clients such as Ajinomoto, Don Quijote, and Airtrip. Managed performance marketing and automation tools that enhanced team productivity. Received the Challenging Award for optimizing advertising workflows and significantly improving team efficiency.',
'アジノモト、ドン・キホーテ、エアトリップなどの大手クライアントの広告キャンペーンを管理。パフォーマンスマーケティングと生産性向上ツールの経験を積みました。広告ワークフローを最適化し、チーム効率を大幅に向上させたことでチャレンジング賞を受賞。',
0,
true,
NOW(),
NOW()
),
(
'Nha Sach Service Joint Stock Company',
'2022 - 2023',
'Developed and executed SEO web writing strategy. Conducted topic research and created style guides for content consistency. Launched internal PR podcast and managed content promotion across multiple channels. Focused on storytelling to engage audiences and build brand awareness.',
'SEOウェブライティング戦略を開発・実行。トピック研究を実施し、コンテンツの一貫性のためのスタイルガイドを作成。社内PRポッドキャストを立ち上げ、複数のチャネルでコンテンツプロモーションを管理。ストーリーテリングに焦点を当てて、オーディエンスの関心を引き、ブランド認知度を構築。',
1,
true,
NOW(),
NOW()
);

-- Insert Work Experience Tasks for GMO Nikko Vietnam
INSERT INTO work_experience_tasks (experience_id, task_en, task_ja, order_index, created_at, updated_at) VALUES
(
(SELECT id FROM work_experiences WHERE company_name = 'GMO Nikko Vietnam' LIMIT 1),
'Internal Communication',
'社内コミュニケーション',
0,
NOW(),
NOW()
),
(
(SELECT id FROM work_experiences WHERE company_name = 'GMO Nikko Vietnam' LIMIT 1),
'Ad Campaign Execution',
'広告キャンペーン実行',
1,
NOW(),
NOW()
),
(
(SELECT id FROM work_experiences WHERE company_name = 'GMO Nikko Vietnam' LIMIT 1),
'Reporting and Automation',
'レポートと自動化',
2,
NOW(),
NOW()
),
(
(SELECT id FROM work_experiences WHERE company_name = 'GMO Nikko Vietnam' LIMIT 1),
'Work Efficiency Optimization',
'業務効率化',
3,
NOW(),
NOW()
);

-- Insert Work Experience Tasks for Nha Sach
INSERT INTO work_experience_tasks (experience_id, task_en, task_ja, order_index, created_at, updated_at) VALUES
(
(SELECT id FROM work_experiences WHERE company_name = 'Nha Sach Service Joint Stock Company' LIMIT 1),
'SEO Web Writing Strategy',
'SEOウェブライティング戦略',
0,
NOW(),
NOW()
),
(
(SELECT id FROM work_experiences WHERE company_name = 'Nha Sach Service Joint Stock Company' LIMIT 1),
'Planning Topic Research and Style Guide Development',
'トピック計画研究とスタイルガイド開発',
1,
NOW(),
NOW()
),
(
(SELECT id FROM work_experiences WHERE company_name = 'Nha Sach Service Joint Stock Company' LIMIT 1),
'Internal PR Podcast Development',
'社内PRポッドキャスト開発',
2,
NOW(),
NOW()
),
(
(SELECT id FROM work_experiences WHERE company_name = 'Nha Sach Service Joint Stock Company' LIMIT 1),
'Content Promotion',
'コンテンツプロモーション',
3,
NOW(),
NOW()
),
(
(SELECT id FROM work_experiences WHERE company_name = 'Nha Sach Service Joint Stock Company' LIMIT 1),
'Storytelling',
'ストーリーテリング',
4,
NOW(),
NOW()
);
