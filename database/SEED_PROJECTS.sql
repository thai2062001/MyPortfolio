-- Insert 4 projects into the projects table
-- Cấu trúc: projects + project_approaches + project_results + project_testimonials

-- Project 1: Don Quijote Campaign
INSERT INTO public.projects (
  slug, title, category_id, short_description, description, overview, challenge, solution,
  client, duration, role, year, cover_image_url, tall, is_featured, is_published
) VALUES (
  'don-quijote-campaign',
  'Don Quijote Campaign',
  NULL,
  'Managed comprehensive advertising campaigns for Don Quijote',
  'Managed comprehensive advertising campaigns for Don Quijote, a leading Japanese retail company, optimizing ad performance and driving customer acquisition through data-driven strategies.',
  'Managed comprehensive advertising campaigns for Don Quijote, a leading Japanese retail company, optimizing ad performance and driving customer acquisition through data-driven strategies.',
  'Don Quijote needed to increase brand awareness and drive foot traffic to their stores while managing advertising budgets efficiently across multiple channels.',
  'Analyzed campaign performance data using Excel and Google Sheets to identify optimization opportunities. Designed and executed multi-channel advertising strategies across digital platforms. Created automated reporting dashboards to track KPIs and campaign metrics in real-time. Optimized ad spend allocation based on performance data and market trends.',
  'Don Quijote',
  'Ongoing',
  'Advertising Manager',
  '2023',
  'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&h=800&fit=crop',
  false,
  false,
  true
) RETURNING id AS project_1_id;

-- Project 2: AirTrip Campaign
INSERT INTO public.projects (
  slug, title, category_id, short_description, description, overview, challenge, solution,
  client, duration, role, year, cover_image_url, tall, is_featured, is_published
) VALUES (
  'airtrip-campaign',
  'AirTrip Campaign',
  NULL,
  'Executed targeted advertising campaigns for AirTrip',
  'Executed targeted advertising campaigns for AirTrip, a travel booking platform, focusing on customer acquisition and engagement through performance marketing strategies.',
  'Executed targeted advertising campaigns for AirTrip, a travel booking platform, focusing on customer acquisition and engagement through performance marketing strategies.',
  'AirTrip required consistent campaign optimization to maintain competitive positioning in the travel industry while maximizing return on advertising spend.',
  'Developed data-driven advertising strategies using SQL and Power Query for data analysis. Implemented automation tools to streamline campaign management and reporting processes. Monitored campaign performance metrics and adjusted strategies based on real-time data. Collaborated with cross-functional teams to align advertising goals with business objectives.',
  'AirTrip',
  'Ongoing',
  'Advertising Manager',
  '2023',
  'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200&h=800&fit=crop',
  true,
  false,
  true
) RETURNING id AS project_2_id;

-- Project 3: Ajinomoto Campaign
INSERT INTO public.projects (
  slug, title, category_id, short_description, description, overview, challenge, solution,
  client, duration, role, year, cover_image_url, tall, is_featured, is_published
) VALUES (
  'ajinomoto-campaign',
  'Ajinomoto Campaign',
  NULL,
  'Managed advertising campaigns for Ajinomoto',
  'Managed advertising campaigns for Ajinomoto, a global food company, leveraging data analytics and automation to drive brand awareness and product sales.',
  'Managed advertising campaigns for Ajinomoto, a global food company, leveraging data analytics and automation to drive brand awareness and product sales.',
  'Ajinomoto needed to maintain market presence and drive consumer engagement across multiple product lines while optimizing advertising budgets.',
  'Created comprehensive dashboards using Google Sheets and Excel for campaign tracking. Implemented VBA scripts to automate repetitive reporting tasks and improve efficiency. Analyzed campaign data to identify trends and optimization opportunities. Executed targeted advertising strategies to reach key consumer segments.',
  'Ajinomoto',
  'Ongoing',
  'Advertising Manager',
  '2023',
  'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1200&h=800&fit=crop',
  false,
  false,
  true
) RETURNING id AS project_3_id;

-- Project 4: Portfolio Optimization Project
INSERT INTO public.projects (
  slug, title, category_id, short_description, description, overview, challenge, solution,
  client, duration, role, year, cover_image_url, tall, is_featured, is_published
) VALUES (
  'portfolio-optimization',
  'Portfolio Optimization Project',
  NULL,
  'Led a comprehensive workflow optimization project',
  'Led a comprehensive workflow optimization project that streamlined advertising campaign management processes, resulting in the Challenging Award for exceptional performance improvement.',
  'Led a comprehensive workflow optimization project that streamlined advertising campaign management processes, resulting in the Challenging Award for exceptional performance improvement.',
  'The advertising team faced inefficient manual processes that consumed significant time and resources, limiting the ability to scale campaign management and respond quickly to market changes.',
  'Conducted process audit to identify bottlenecks and inefficiencies in current workflows. Designed automated solutions using Google App Scripts and Power Query to eliminate manual tasks. Implemented new reporting systems with real-time dashboards for better visibility. Trained team members on new tools and processes to ensure smooth adoption.',
  'GMO Nikko Vietnam',
  '3 months',
  'Project Lead',
  '2024',
  'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&h=800&fit=crop',
  true,
  false,
  true
) RETURNING id AS project_4_id;

-- Insert approaches for Project 1
INSERT INTO public.project_approaches (project_id, approach, order_index) 
SELECT id, approach, order_index FROM (
  SELECT (SELECT id FROM public.projects WHERE slug = 'don-quijote-campaign') as id, 'Analyzed campaign performance data using Excel and Google Sheets to identify optimization opportunities' as approach, 0 as order_index
  UNION ALL
  SELECT (SELECT id FROM public.projects WHERE slug = 'don-quijote-campaign'), 'Designed and executed multi-channel advertising strategies across digital platforms', 1
  UNION ALL
  SELECT (SELECT id FROM public.projects WHERE slug = 'don-quijote-campaign'), 'Created automated reporting dashboards to track KPIs and campaign metrics in real-time', 2
  UNION ALL
  SELECT (SELECT id FROM public.projects WHERE slug = 'don-quijote-campaign'), 'Optimized ad spend allocation based on performance data and market trends', 3
) t;

-- Insert approaches for Project 2
INSERT INTO public.project_approaches (project_id, approach, order_index)
SELECT id, approach, order_index FROM (
  SELECT (SELECT id FROM public.projects WHERE slug = 'airtrip-campaign') as id, 'Developed data-driven advertising strategies using SQL and Power Query for data analysis' as approach, 0 as order_index
  UNION ALL
  SELECT (SELECT id FROM public.projects WHERE slug = 'airtrip-campaign'), 'Implemented automation tools to streamline campaign management and reporting processes', 1
  UNION ALL
  SELECT (SELECT id FROM public.projects WHERE slug = 'airtrip-campaign'), 'Monitored campaign performance metrics and adjusted strategies based on real-time data', 2
  UNION ALL
  SELECT (SELECT id FROM public.projects WHERE slug = 'airtrip-campaign'), 'Collaborated with cross-functional teams to align advertising goals with business objectives', 3
) t;

-- Insert approaches for Project 3
INSERT INTO public.project_approaches (project_id, approach, order_index)
SELECT id, approach, order_index FROM (
  SELECT (SELECT id FROM public.projects WHERE slug = 'ajinomoto-campaign') as id, 'Created comprehensive dashboards using Google Sheets and Excel for campaign tracking' as approach, 0 as order_index
  UNION ALL
  SELECT (SELECT id FROM public.projects WHERE slug = 'ajinomoto-campaign'), 'Implemented VBA scripts to automate repetitive reporting tasks and improve efficiency', 1
  UNION ALL
  SELECT (SELECT id FROM public.projects WHERE slug = 'ajinomoto-campaign'), 'Analyzed campaign data to identify trends and optimization opportunities', 2
  UNION ALL
  SELECT (SELECT id FROM public.projects WHERE slug = 'ajinomoto-campaign'), 'Executed targeted advertising strategies to reach key consumer segments', 3
) t;

-- Insert approaches for Project 4
INSERT INTO public.project_approaches (project_id, approach, order_index)
SELECT id, approach, order_index FROM (
  SELECT (SELECT id FROM public.projects WHERE slug = 'portfolio-optimization') as id, 'Conducted process audit to identify bottlenecks and inefficiencies in current workflows' as approach, 0 as order_index
  UNION ALL
  SELECT (SELECT id FROM public.projects WHERE slug = 'portfolio-optimization'), 'Designed automated solutions using Google App Scripts and Power Query to eliminate manual tasks', 1
  UNION ALL
  SELECT (SELECT id FROM public.projects WHERE slug = 'portfolio-optimization'), 'Implemented new reporting systems with real-time dashboards for better visibility', 2
  UNION ALL
  SELECT (SELECT id FROM public.projects WHERE slug = 'portfolio-optimization'), 'Trained team members on new tools and processes to ensure smooth adoption', 3
) t;

-- Insert results for Project 1
INSERT INTO public.project_results (project_id, label, value, order_index)
SELECT id, label, value, order_index FROM (
  SELECT (SELECT id FROM public.projects WHERE slug = 'don-quijote-campaign') as id, 'Campaign Performance' as label, 'Optimized' as value, 0 as order_index
  UNION ALL
  SELECT (SELECT id FROM public.projects WHERE slug = 'don-quijote-campaign'), 'Ad Efficiency', 'Improved', 1
  UNION ALL
  SELECT (SELECT id FROM public.projects WHERE slug = 'don-quijote-campaign'), 'Customer Reach', 'Expanded', 2
  UNION ALL
  SELECT (SELECT id FROM public.projects WHERE slug = 'don-quijote-campaign'), 'ROI', 'Positive', 3
) t;

-- Insert results for Project 2
INSERT INTO public.project_results (project_id, label, value, order_index)
SELECT id, label, value, order_index FROM (
  SELECT (SELECT id FROM public.projects WHERE slug = 'airtrip-campaign') as id, 'Campaign Reach' as label, 'Increased' as value, 0 as order_index
  UNION ALL
  SELECT (SELECT id FROM public.projects WHERE slug = 'airtrip-campaign'), 'Conversion Rate', 'Improved', 1
  UNION ALL
  SELECT (SELECT id FROM public.projects WHERE slug = 'airtrip-campaign'), 'Customer Acquisition', 'Optimized', 2
  UNION ALL
  SELECT (SELECT id FROM public.projects WHERE slug = 'airtrip-campaign'), 'Efficiency Gain', 'Significant', 3
) t;

-- Insert results for Project 3
INSERT INTO public.project_results (project_id, label, value, order_index)
SELECT id, label, value, order_index FROM (
  SELECT (SELECT id FROM public.projects WHERE slug = 'ajinomoto-campaign') as id, 'Brand Awareness' as label, 'Enhanced' as value, 0 as order_index
  UNION ALL
  SELECT (SELECT id FROM public.projects WHERE slug = 'ajinomoto-campaign'), 'Sales Performance', 'Boosted', 1
  UNION ALL
  SELECT (SELECT id FROM public.projects WHERE slug = 'ajinomoto-campaign'), 'Workflow Efficiency', '+40%', 2
  UNION ALL
  SELECT (SELECT id FROM public.projects WHERE slug = 'ajinomoto-campaign'), 'Campaign Success', 'Achieved', 3
) t;

-- Insert results for Project 4
INSERT INTO public.project_results (project_id, label, value, order_index)
SELECT id, label, value, order_index FROM (
  SELECT (SELECT id FROM public.projects WHERE slug = 'portfolio-optimization') as id, 'Time Saved' as label, '30+ hours/week' as value, 0 as order_index
  UNION ALL
  SELECT (SELECT id FROM public.projects WHERE slug = 'portfolio-optimization'), 'Process Efficiency', '+50%', 1
  UNION ALL
  SELECT (SELECT id FROM public.projects WHERE slug = 'portfolio-optimization'), 'Team Productivity', '+45%', 2
  UNION ALL
  SELECT (SELECT id FROM public.projects WHERE slug = 'portfolio-optimization'), 'Award', 'Challenging Award', 3
) t;

-- Insert testimonial for Project 4
INSERT INTO public.project_testimonials (project_id, quote, name, title, company, order_index)
SELECT id, quote, name, title, company, order_index FROM (
  SELECT (SELECT id FROM public.projects WHERE slug = 'portfolio-optimization') as id, 
         'Hai Yen''s optimization project transformed how we manage campaigns. The efficiency gains have been remarkable and the team is now able to focus on strategic work.' as quote,
         'GMO Nikko Vietnam' as name,
         'Management Team' as title,
         'GMO Nikko Vietnam' as company,
         0 as order_index
) t;
