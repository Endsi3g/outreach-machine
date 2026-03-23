-- Fix for infinite recursion in RLS policies

-- 1. Drop the recursive policies on team_members
DROP POLICY IF EXISTS "Members can view memberships" ON team_members;
DROP POLICY IF EXISTS "Admins can manage members" ON team_members;

-- 2. Create a non-recursive select policy
-- By allowing all authenticated users to read memberships, we break the infinite
-- recursion chain that happens when leads/campaigns query team_members
CREATE POLICY "Anyone can view team memberships" ON team_members
  FOR SELECT USING (auth.role() = 'authenticated');

-- 3. Create a non-recursive admin manage policy
CREATE POLICY "Team owners can manage members" ON team_members
  FOR ALL USING (
    team_id IN (SELECT id FROM teams WHERE owner_id = auth.uid()::text)
  );

-- 4. In case the leads table also hangs, ensure its policy is clean
DROP POLICY IF EXISTS "Team members can view team leads" ON leads;
CREATE POLICY "Team members can view team leads" ON leads
  FOR SELECT USING (
    team_id IN (SELECT team_id FROM team_members WHERE user_id = auth.uid()::text)
    OR user_id = auth.uid()::text
  );
