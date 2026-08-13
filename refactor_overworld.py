import re

with open('/home/flores/Documents/bellbound/src/components/Overworld.tsx', 'r') as f:
    content = f.read()

# 1. Replace useState for playerPos, direction, walkFrame with useRef
content = content.replace("const [playerPos, setPlayerPos] = useState({ x: 60, y: 220 });", "const playerPosRef = useRef({ x: 60, y: 220 });")
content = content.replace("const [direction, setDirection] = useState<'down' | 'up' | 'left' | 'right'>('down');", "const directionRef = useRef<'down' | 'up' | 'left' | 'right'>('down');")
content = content.replace("const [walkFrame, setWalkFrame] = useState(0);", "const walkFrameRef = useRef(0);")
content = content.replace("const [nearTeacher, setNearTeacher] = useState<SubjectId | null>(null);", "const [nearTeacher, setNearTeacher] = useState<SubjectId | null>(null);\n  const nearTeacherRef = useRef<SubjectId | null>(null);")

# 2. Reset position on room change
content = content.replace("setPlayerPos({ x: 50, y: 210 });", "playerPosRef.current = { x: 50, y: 210 };")

# 3. We need to merge the two useEffects into one requestAnimationFrame loop.
# The first useEffect is from `// Main Render Loop` to `}, [currentRoom, playerPos, direction, walkFrame, customization, completedSubjects]);`
# The second useEffect is from `// Movement & Collision Check Loop` to `}, [currentRoom, completedSubjects, onChangeRoom]);`

# Let's extract the body of the drawing logic
draw_match = re.search(r'// Main Render Loop\s*useEffect\(\(\) => \{(.*?)\}, \[.*?\]\);', content, re.DOTALL)
draw_body = draw_match.group(1)

# Modify draw_body to use refs
draw_body = draw_body.replace("playerPos.x", "playerPosRef.current.x")
draw_body = draw_body.replace("playerPos.y", "playerPosRef.current.y")
draw_body = draw_body.replace("direction", "directionRef.current")
draw_body = draw_body.replace("walkFrame", "walkFrameRef.current")

# Extract the movement logic
move_match = re.search(r'// Movement & Collision Check Loop\s*useEffect\(\(\) => \{(.*?)\}, \[.*?\]\);', content, re.DOTALL)
move_body = move_match.group(1)

# Rewrite movement logic
new_move_body = """
    let animationFrameId: number;

    const renderLoop = () => {
      let dx = 0;
      let dy = 0;
      const speed = 2.5; // Optimized 60FPS speed

      if (keysPressed.current['ArrowLeft'] || keysPressed.current['a'] || keysPressed.current['A']) {
        dx -= speed;
        directionRef.current = 'left';
      } else if (keysPressed.current['ArrowRight'] || keysPressed.current['d'] || keysPressed.current['D']) {
        dx += speed;
        directionRef.current = 'right';
      }

      if (keysPressed.current['ArrowUp'] || keysPressed.current['w'] || keysPressed.current['W']) {
        dy -= speed;
        directionRef.current = 'up';
      } else if (keysPressed.current['ArrowDown'] || keysPressed.current['s'] || keysPressed.current['S']) {
        dy += speed;
        directionRef.current = 'down';
      }

      if (dx !== 0 || dy !== 0) {
        const now = Date.now();
        if (now - lastWalkTime.current > 120) {
           audioEngine.playStep();
           walkFrameRef.current += 1;
           lastWalkTime.current = now;
        }
        
        let newX = Math.max(10, Math.min(590, playerPosRef.current.x + dx));
        let newY = Math.max(110, Math.min(290, playerPosRef.current.y + dy));

        if (currentRoom !== 'hall') {
          const checkCollision = (cx: number, cy: number) => {
            const px = cx + 20; 
            const py = cy + 55; 
            for (let col = 0; col < 3; col++) {
              for (let row = 0; row < 4; row++) {
                const dx2 = 165 + (col * 120);
                const dy2 = 165 + (row * 45);
                if (px > dx2 - 5 && px < dx2 + 75 && py > dy2 + 5 && py < dy2 + 32) return true;
              }
            }
            if (px > 500 - 5 && px < 500 + 95 && py > 130 + 5 && py < 130 + 35) return true;
            return false;
          };

          if (checkCollision(newX, playerPosRef.current.y)) newX = playerPosRef.current.x;
          if (checkCollision(playerPosRef.current.x, newY)) newY = playerPosRef.current.y;
          if (checkCollision(newX, newY)) {
            newX = playerPosRef.current.x;
            newY = playerPosRef.current.y;
          }
        }

        let nextNearTeacher: any = null;

        if (currentRoom === 'hall') {
          const SCHEDULE: import('../types').SubjectId[] = ['pkn', 'rpl', 'indo', 'inggris', 'bio', 'math'];
          const currentLevel = completedSubjects.length;
          const currentSubject = SCHEDULE[Math.min(currentLevel, 5)];
          const doorLocs: { id: import('../types').SubjectId; x: number }[] = [
            { id: 'pkn', x: 20 }, { id: 'rpl', x: 130 }, { id: 'indo', x: 240 },
            { id: 'inggris', x: 350 }, { id: 'bio', x: 460 }, { id: 'math', x: 570 },
          ];

          doorLocs.forEach((d) => {
            if (Math.abs(newX - d.x) < 30 && newY < 125) {
              if (isDoorUnlocked(d.id)) {
                onChangeRoom(d.id);
              } else if (completedSubjects.includes(d.id)) {
                setDialogueText('Kelas ini sudah selesai.');
              } else {
                setDialogueText('Kelas ini terkunci. Cek jadwalmu!');
              }
            }
          });

          if (completedSubjects.length === 5 && Math.abs(newX - 580) < 40 && Math.abs(newY - 140) < 40) {
            nextNearTeacher = 'math';
          }
        } else {
          if (Math.abs(newX - 20) < 35 && newY < 125) {
            if (currentRoom === 'pkn' && !completedSubjects.includes('pkn')) {
              setDialogueText('Pak Arif (GURU PKN) tersenyum: "Selesaikan ujian PKN terlebih dahulu sebelum pergi ke lorong!"');
            } else {
              onChangeRoom('hall');
            }
          }
          if (Math.abs(newX - 520) < 60 && Math.abs(newY - 130) < 50) {
            nextNearTeacher = currentRoom;
          }
        }

        if (nearTeacherRef.current !== nextNearTeacher) {
          nearTeacherRef.current = nextNearTeacher;
          setNearTeacher(nextNearTeacher);
        }

        playerPosRef.current = { x: newX, y: newY };
      }
""" + draw_body + """
      animationFrameId = requestAnimationFrame(renderLoop);
    };
    
    renderLoop();
    return () => cancelAnimationFrame(animationFrameId);
"""

# Now we replace BOTH useEffects with our unified one.
# First, remove the first useEffect entirely.
content = content.replace(draw_match.group(0), "")

# Then replace the second useEffect with the unified one.
content = content.replace(move_match.group(0), f"// Unified Engine Loop (Optimized 60FPS)\n  useEffect(() => {{{new_move_body}}}, [currentRoom, completedSubjects, onChangeRoom, customization]);")

with open('/home/flores/Documents/bellbound/src/components/Overworld.tsx', 'w') as f:
    f.write(content)

print("Refactor complete.")
