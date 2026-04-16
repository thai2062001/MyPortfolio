# Skill Module - Usage Examples

## Adding Skills via SQL

### Example 1: Add a New Skill Category

```sql
INSERT INTO public.skill_categories (slug, name, description, icon_url, order_index, is_published)
VALUES (
  'project-management',
  'Project Management',
  'Master the art of leading teams and delivering projects on time',
  'https://example.com/icons/project-management.svg',
  5,
  TRUE
);
```

### Example 2: Add a Complete Skill with All Related Data

```sql
-- 1. Get the category ID
WITH category AS (
  SELECT id FROM public.skill_categories WHERE slug = 'project-management'
)

-- 2. Insert the skill
INSERT INTO public.skills (
  slug, category_id, skill_name, short_description, overview,
  application, use_cases, difficulty_level, experience_level,
  estimated_time, key_points, order_index, is_published
)
SELECT
  'agile-methodology',
  c.id,
  'Agile Methodology',
  'Learn to manage projects using Agile principles',
  'Agile is an iterative approach to project management that emphasizes flexibility, collaboration, and continuous improvement.',
  'Apply Agile principles to deliver projects faster and adapt to changing requirements',
  'Software development, product launches, team coordination, startup environments',
  'Intermediate',
  'Beginner to Intermediate',
  '6-8 weeks',
  ARRAY[
    'Sprint planning and execution',
    'Daily standups and retrospectives',
    'Backlog management',
    'Team collaboration',
    'Continuous delivery'
  ],
  1,
  TRUE
FROM category c;

-- 3. Get the skill ID for related data
WITH skill AS (
  SELECT id FROM public.skills WHERE slug = 'agile-methodology'
)

-- 4. Add highlights
INSERT INTO public.skill_highlights (skill_id, title, description, order_index)
SELECT
  s.id,
  'Faster Delivery',
  'Deliver working software every 2-4 weeks instead of months',
  1
FROM skill s

UNION ALL

SELECT
  s.id,
  'Better Collaboration',
  'Improve team communication and stakeholder engagement',
  2
FROM skill s;

-- 5. Add applications
INSERT INTO public.skill_applications (skill_id, title, description, order_index)
SELECT
  s.id,
  'Software Development',
  'Manage development teams using Scrum or Kanban',
  1
FROM skill s

UNION ALL

SELECT
  s.id,
  'Product Management',
  'Coordinate product launches with cross-functional teams',
  2
FROM skill s;

-- 6. Add tools
INSERT INTO public.skill_tools (skill_id, tool_name, description, tool_url, order_index)
SELECT
  s.id,
  'Jira',
  'Track and manage Agile projects',
  'https://www.atlassian.com/software/jira',
  1
FROM skill s

UNION ALL

SELECT
  s.id,
  'Trello',
  'Simple Kanban board for task management',
  'https://trello.com',
  2
FROM skill s;

-- 7. Add learning steps
INSERT INTO public.skill_steps (skill_id, step_title, step_description, order_index)
SELECT
  s.id,
  'Understand Agile Principles',
  'Learn the 12 Agile principles and Manifesto',
  1
FROM skill s

UNION ALL

SELECT
  s.id,
  'Master Scrum Framework',
  'Understand roles, ceremonies, and artifacts in Scrum',
  2
FROM skill s

UNION ALL

SELECT
  s.id,
  'Practice with Real Projects',
  'Apply Agile to actual projects and iterate',
  3
FROM skill s;
```

## Using the API in Components

### Example 1: Display All Skills in a Category

```typescript
import { useEffect, useState } from "react";
import { getSkillsByCategory } from "@/lib/supabase-skill-queries";
import type { Skill } from "@/types/skills";

export function SkillsList({ categoryId }: { categoryId: string }) {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const data = await getSkillsByCategory(categoryId);
        setSkills(data);
      } catch (error) {
        console.error("Error fetching skills:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSkills();
  }, [categoryId]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {skills.map((skill) => (
        <div key={skill.id} className="border rounded-lg p-4">
          <h3 className="text-lg font-serif">{skill.skill_name}</h3>
          <p className="text-sm text-gray-600">{skill.short_description}</p>
          {skill.difficulty_level && (
            <span className="text-xs bg-sage/10 text-sage px-2 py-1 rounded">
              {skill.difficulty_level}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
```

### Example 2: Display Skill Detail with All Related Data

```typescript
import { useEffect, useState } from "react";
import { getCompleteSkillDetail } from "@/lib/supabase-skill-queries";

export function SkillDetailView({ skillId }: { skillId: string }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const detail = await getCompleteSkillDetail(skillId);
        setData(detail);
      } catch (error) {
        console.error("Error fetching skill detail:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [skillId]);

  if (loading) return <div>Loading...</div>;
  if (!data?.skill) return <div>Skill not found</div>;

  const { skill, highlights, applications, tools, steps } = data;

  return (
    <div className="space-y-12">
      {/* Overview */}
      <section>
        <h2 className="text-3xl font-serif mb-4">Overview</h2>
        <p className="text-lg text-gray-700">{skill.overview}</p>
      </section>

      {/* Highlights */}
      {highlights.length > 0 && (
        <section>
          <h2 className="text-3xl font-serif mb-4">Highlights</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {highlights.map((h) => (
              <div key={h.id} className="border rounded-lg p-4">
                <h3 className="font-serif mb-2">{h.title}</h3>
                <p className="text-sm text-gray-600">{h.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Tools */}
      {tools.length > 0 && (
        <section>
          <h2 className="text-3xl font-serif mb-4">Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {tools.map((tool) => (
              <div key={tool.id} className="border rounded-lg p-4">
                {tool.icon_url && (
                  <img
                    src={tool.icon_url}
                    alt={tool.tool_name}
                    className="w-8 h-8 mb-2"
                  />
                )}
                <h3 className="font-medium">{tool.tool_name}</h3>
                <p className="text-xs text-gray-600 mt-1">
                  {tool.description}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Learning Steps */}
      {steps.length > 0 && (
        <section>
          <h2 className="text-3xl font-serif mb-4">Learning Path</h2>
          <div className="space-y-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-sage text-white flex items-center justify-center flex-shrink-0">
                  {index + 1}
                </div>
                <div>
                  <h3 className="font-serif">{step.step_title}</h3>
                  <p className="text-sm text-gray-600">
                    {step.step_description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
```

## Querying Examples

### Example 1: Get All Skills with Difficulty Level

```typescript
import { supabase } from "@/lib/supabase";

const getSkillsByDifficulty = async (level: string) => {
  const { data, error } = await supabase
    .from("skills")
    .select("*")
    .eq("difficulty_level", level)
    .eq("is_published", true)
    .order("order_index", { ascending: true });

  if (error) throw error;
  return data;
};

// Usage
const beginnerSkills = await getSkillsByDifficulty("Beginner");
```

### Example 2: Get Skills with Related Data Count

```typescript
const getSkillsWithStats = async (categoryId: string) => {
  const { data, error } = await supabase
    .from("skills")
    .select(
      `
      *,
      skill_highlights(count),
      skill_applications(count),
      skill_tools(count),
      skill_steps(count)
    `,
    )
    .eq("category_id", categoryId)
    .eq("is_published", true);

  if (error) throw error;
  return data;
};
```

### Example 3: Search Skills by Name

```typescript
const searchSkills = async (query: string) => {
  const { data, error } = await supabase
    .from("skills")
    .select("*")
    .ilike("skill_name", `%${query}%`)
    .eq("is_published", true)
    .limit(10);

  if (error) throw error;
  return data;
};

// Usage
const results = await searchSkills("marketing");
```

## Admin Panel Examples

### Example 1: Skill Management Page

```typescript
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import type { Skill } from "@/types/skills";

export function SkillsAdmin() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    const { data, error } = await supabase
      .from("skills")
      .select("*")
      .order("order_index", { ascending: true });

    if (!error) setSkills(data || []);
    setLoading(false);
  };

  const updateSkill = async (id: string, updates: Partial<Skill>) => {
    const { error } = await supabase
      .from("skills")
      .update(updates)
      .eq("id", id);

    if (!error) {
      fetchSkills();
    }
  };

  const deleteSkill = async (id: string) => {
    const { error } = await supabase
      .from("skills")
      .delete()
      .eq("id", id);

    if (!error) {
      fetchSkills();
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-serif">Manage Skills</h1>
      <table className="w-full border">
        <thead>
          <tr className="border-b">
            <th className="text-left p-4">Skill Name</th>
            <th className="text-left p-4">Difficulty</th>
            <th className="text-left p-4">Published</th>
            <th className="text-left p-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {skills.map((skill) => (
            <tr key={skill.id} className="border-b">
              <td className="p-4">{skill.skill_name}</td>
              <td className="p-4">{skill.difficulty_level}</td>
              <td className="p-4">
                <input
                  type="checkbox"
                  checked={skill.is_published}
                  onChange={(e) =>
                    updateSkill(skill.id, { is_published: e.target.checked })
                  }
                />
              </td>
              <td className="p-4">
                <button
                  onClick={() => deleteSkill(skill.id)}
                  className="text-red-600 hover:underline"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

## Real-World Scenarios

### Scenario 1: Display Related Skills

```typescript
const getRelatedSkills = async (skillId: string) => {
  // Get the current skill
  const skill = await getSkillById(skillId);
  if (!skill?.related_skill_ids) return [];

  // Get related skills
  const { data, error } = await supabase
    .from("skills")
    .select("*")
    .in("id", skill.related_skill_ids)
    .eq("is_published", true);

  if (error) throw error;
  return data;
};
```

### Scenario 2: Skill Progression Path

```typescript
const getSkillProgression = async (categoryId: string) => {
  const { data, error } = await supabase
    .from("skills")
    .select("*")
    .eq("category_id", categoryId)
    .eq("is_published", true)
    .order("difficulty_level", { ascending: true })
    .order("order_index", { ascending: true });

  if (error) throw error;
  return data;
};

// Returns skills ordered by difficulty: Beginner → Intermediate → Advanced
```

### Scenario 3: Skill Statistics

```typescript
const getSkillStats = async () => {
  const { data: categories } = await supabase
    .from("skill_categories")
    .select("id, name");

  const stats = await Promise.all(
    (categories || []).map(async (cat) => {
      const { count } = await supabase
        .from("skills")
        .select("*", { count: "exact", head: true })
        .eq("category_id", cat.id)
        .eq("is_published", true);

      return {
        category: cat.name,
        skillCount: count || 0,
      };
    }),
  );

  return stats;
};
```

## Tips & Best Practices

### 1. Always Check is_published

```typescript
// ✅ Good
.eq("is_published", true)

// ❌ Bad - shows unpublished skills
.select("*")
```

### 2. Use Slugs for URLs

```typescript
// ✅ Good - SEO friendly
/skills/adgiilt -
  marketing / seo -
  optimization /
    // ❌ Bad - not SEO friendly
    skills /
    123 /
    456;
```

### 3. Fetch Related Data in Parallel

```typescript
// ✅ Good - faster
const [skill, highlights, tools] = await Promise.all([
  getSkillById(id),
  getSkillHighlights(id),
  getSkillTools(id),
]);

// ❌ Bad - slower
const skill = await getSkillById(id);
const highlights = await getSkillHighlights(id);
const tools = await getSkillTools(id);
```

### 4. Use Proper Error Handling

```typescript
// ✅ Good
try {
  const data = await getSkillBySlug(slug);
  if (!data) return <NotFound />;
} catch (error) {
  console.error("Error:", error);
  return <Error />;
}

// ❌ Bad - no error handling
const data = await getSkillBySlug(slug);
```

---

For more examples, check the source code in:

- `src/pages/Skills.tsx`
- `src/pages/SkillCategory.tsx`
- `src/pages/SkillDetail.tsx`
