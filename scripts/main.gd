extends Node2D

const PLAYER_SCRIPT = preload("res://scripts/player.gd")
const ENEMY_SCRIPT = preload("res://scripts/enemy.gd")

var player: Vanguard
var current_wave: int = -1
var wave_active: bool = false
var wave_started_at: int = 0
var kills: int = 0
var damage_taken: float = 0.0
var skill_damage: Dictionary = {}
var simulation_speed: float = 1.0

var wave_label: Label
var hp_label: Label
var skills_label: Label
var speed_label: Label
var summary_label: Label
var next_button: Button

var waves := [
	{"name": "Swarm Test", "packs": [{"type": "rotling", "count": 12}]},
	{"name": "Frontline", "packs": [{"type": "rotling", "count": 8}, {"type": "boneguard", "count": 3}]},
	{"name": "Ranged Pressure", "packs": [{"type": "rotling", "count": 10}, {"type": "archer", "count": 4}]},
	{"name": "Threat Priority", "packs": [{"type": "rotling", "count": 8}, {"type": "boneguard", "count": 2}, {"type": "exploder", "count": 3}]},
	{"name": "Support Target", "packs": [{"type": "rotling", "count": 10}, {"type": "boneguard", "count": 2}, {"type": "archer", "count": 2}, {"type": "necromancer", "count": 1}]},
	{"name": "Elite Check", "packs": [{"type": "rotling", "count": 8}, {"type": "frenzied_boneguard", "count": 1}]},
	{"name": "Goremaw", "packs": [{"type": "goremaw", "count": 1}]}
]

func _ready() -> void:
	randomize()
	build_hud()
	spawn_player()
	start_wave(0)
	queue_redraw()

func _process(_delta: float) -> void:
	if Input.is_action_just_pressed("speed_1"):
		set_speed(1.0)
	elif Input.is_action_just_pressed("speed_2"):
		set_speed(2.0)
	elif Input.is_action_just_pressed("speed_3"):
		set_speed(3.0)
	if Input.is_action_just_pressed("next_wave") and not wave_active:
		_on_next_pressed()
	update_hud()

func _draw() -> void:
	draw_rect(Rect2(0, 0, 1280, 720), Color(0.045, 0.055, 0.07))
	draw_rect(Rect2(45, 85, 1190, 590), Color(0.075, 0.085, 0.10), true)
	draw_rect(Rect2(45, 85, 1190, 590), Color(0.24, 0.28, 0.34), false, 3.0)
	for x in range(80, 1230, 80):
		draw_line(Vector2(x, 85), Vector2(x, 675), Color(0.12, 0.13, 0.16), 1.0)
	for y in range(115, 675, 80):
		draw_line(Vector2(45, y), Vector2(1235, y), Color(0.12, 0.13, 0.16), 1.0)

func build_hud() -> void:
	var canvas := CanvasLayer.new()
	canvas.name = "HUD"
	add_child(canvas)

	var top_panel := ColorRect.new()
	top_panel.position = Vector2(0, 0)
	top_panel.size = Vector2(1280, 70)
	top_panel.color = Color(0.02, 0.025, 0.035, 0.94)
	canvas.add_child(top_panel)

	wave_label = Label.new()
	wave_label.position = Vector2(24, 15)
	wave_label.add_theme_font_size_override("font_size", 25)
	canvas.add_child(wave_label)

	hp_label = Label.new()
	hp_label.position = Vector2(425, 17)
	hp_label.add_theme_font_size_override("font_size", 21)
	canvas.add_child(hp_label)

	skills_label = Label.new()
	skills_label.position = Vector2(650, 17)
	skills_label.add_theme_font_size_override("font_size", 18)
	canvas.add_child(skills_label)

	speed_label = Label.new()
	speed_label.position = Vector2(1110, 17)
	speed_label.add_theme_font_size_override("font_size", 18)
	canvas.add_child(speed_label)

	summary_label = Label.new()
	summary_label.position = Vector2(430, 220)
	summary_label.size = Vector2(420, 260)
	summary_label.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	summary_label.vertical_alignment = VERTICAL_ALIGNMENT_CENTER
	summary_label.add_theme_font_size_override("font_size", 21)
	summary_label.visible = false
	canvas.add_child(summary_label)

	next_button = Button.new()
	next_button.position = Vector2(540, 500)
	next_button.size = Vector2(200, 52)
	next_button.text = "NEXT WAVE [SPACE]"
	next_button.visible = false
	next_button.pressed.connect(_on_next_pressed)
	canvas.add_child(next_button)

	var hint := Label.new()
	hint.position = Vector2(28, 685)
	hint.text = "Auto-combat graybox  •  [1] 1x   [2] 2x   [3] 3x   •   SPACE = next/restart"
	hint.add_theme_font_size_override("font_size", 14)
	canvas.add_child(hint)

func spawn_player() -> void:
	if player != null and is_instance_valid(player):
		player.queue_free()
	player = PLAYER_SCRIPT.new() as Vanguard
	player.position = Vector2(640, 380)
	add_child(player)

func start_wave(index: int) -> void:
	clear_enemies()
	if player == null or not is_instance_valid(player) or player.dead:
		spawn_player()
	else:
		player.hp = player.max_hp
		player.global_position = Vector2(640, 380)
		player.velocity = Vector2.ZERO
		player.queue_redraw()

	if index >= waves.size():
		current_wave = waves.size() - 1
		wave_active = false
		summary_label.text = "GOAL 01 LOOP COMPLETE\n\nSeven graybox encounters cleared.\n\nReplay from Wave 1 and judge one thing:\nDo you immediately want another run?"
		summary_label.visible = true
		next_button.text = "REPLAY FROM WAVE 1"
		next_button.visible = true
		return

	current_wave = index
	wave_active = true
	wave_started_at = Time.get_ticks_msec()
	kills = 0
	damage_taken = 0.0
	skill_damage.clear()
	summary_label.visible = false
	next_button.visible = false

	var all_types: Array[String] = []
	for pack in waves[current_wave]["packs"]:
		for i in int(pack["count"]):
			all_types.append(String(pack["type"]))
	for i in all_types.size():
		spawn_enemy(all_types[i], spawn_point(i, all_types.size()))
	update_hud()

func spawn_enemy(enemy_type: String, spawn_position: Vector2 = Vector2.INF) -> Enemy:
	var enemy := ENEMY_SCRIPT.new() as Enemy
	enemy.setup(enemy_type)
	if spawn_position == Vector2.INF:
		spawn_position = Vector2(randf_range(160.0, 1120.0), randf_range(150.0, 610.0))
	enemy.position = Vector2(clampf(spawn_position.x, 70.0, 1210.0), clampf(spawn_position.y, 105.0, 650.0))
	add_child(enemy)
	return enemy

func spawn_point(index: int, total: int) -> Vector2:
	var center := Vector2(640, 380)
	var angle := (TAU * float(index) / maxf(1.0, float(total))) + randf_range(-0.18, 0.18)
	var radius := randf_range(250.0, 390.0)
	return center + Vector2.from_angle(angle) * radius

func clear_enemies() -> void:
	for node in get_tree().get_nodes_in_group("enemies"):
		if is_instance_valid(node):
			node.queue_free()

func register_damage(skill_name: String, amount: float) -> void:
	skill_damage[skill_name] = float(skill_damage.get(skill_name, 0.0)) + amount

func register_damage_taken(amount: float) -> void:
	damage_taken += amount

func register_kill(actor: CombatActor, source: Node) -> void:
	if actor.team == &"enemy" and source == player:
		kills += 1
	call_deferred("check_wave_clear")

func check_wave_clear() -> void:
	if not wave_active:
		return
	for node in get_tree().get_nodes_in_group("enemies"):
		var enemy := node as CombatActor
		if enemy != null and not enemy.dead:
			return
	finish_wave()

func finish_wave() -> void:
	if not wave_active:
		return
	wave_active = false
	var duration := float(Time.get_ticks_msec() - wave_started_at) / 1000.0
	var total_damage := 0.0
	for amount in skill_damage.values():
		total_damage += float(amount)
	var lines: Array[String] = []
	lines.append("VICTORY")
	lines.append("")
	lines.append("Duration      %.1fs" % duration)
	lines.append("Damage dealt %d" % int(total_damage))
	lines.append("Damage taken %d" % int(damage_taken))
	lines.append("Kills        %d" % kills)
	lines.append("")
	var sorted_skills := skill_damage.keys()
	sorted_skills.sort_custom(func(a, b): return float(skill_damage[a]) > float(skill_damage[b]))
	for skill in sorted_skills:
		var value := float(skill_damage[skill])
		var pct := 0.0 if total_damage <= 0.0 else value / total_damage * 100.0
		lines.append("%-13s %5.1f%%" % [String(skill), pct])
	summary_label.text = "\n".join(lines)
	summary_label.visible = true
	next_button.text = "NEXT WAVE [SPACE]"
	next_button.visible = true

func _on_next_pressed() -> void:
	if wave_active:
		return
	if player == null or not is_instance_valid(player) or player.dead:
		start_wave(maxi(0, current_wave))
	elif current_wave >= waves.size() - 1 and summary_label.text.begins_with("GOAL"):
		start_wave(0)
	else:
		start_wave(current_wave + 1)

func set_speed(value: float) -> void:
	simulation_speed = value
	Engine.time_scale = value
	update_hud()

func update_hud() -> void:
	if current_wave >= 0 and current_wave < waves.size():
		wave_label.text = "WAVE %d / %d — %s" % [current_wave + 1, waves.size(), String(waves[current_wave]["name"])]
	if player != null and is_instance_valid(player):
		hp_label.text = "HP  %d / %d" % [maxi(0, int(player.hp)), int(player.max_hp)]
		skills_label.text = "Slash %.1f  |  Whirl %.1f  |  Slam %.1f" % [player.attack_cooldown, player.whirlwind_cooldown, player.slam_cooldown]
		if player.dead and wave_active:
			wave_active = false
			summary_label.text = "DEFEAT\n\nThe build failed this encounter.\n\nDamage dealt: %d\nDamage taken: %d" % [int(total_registered_damage()), int(damage_taken)]
			summary_label.visible = true
			next_button.text = "RESTART WAVE [SPACE]"
			next_button.visible = true
	speed_label.text = "SPEED  %.0fx" % simulation_speed

func total_registered_damage() -> float:
	var total := 0.0
	for amount in skill_damage.values():
		total += float(amount)
	return total

func spawn_damage_number(world_position: Vector2, amount: float, crit: bool) -> void:
	var label := Label.new()
	label.text = "%d%s" % [int(round(amount)), "!" if crit else ""]
	label.position = world_position + Vector2(randf_range(-12.0, 12.0), -32.0)
	label.z_index = 50
	label.add_theme_font_size_override("font_size", 22 if not crit else 30)
	label.modulate = Color(0.92, 0.94, 1.0) if not crit else Color(1.0, 0.74, 0.20)
	add_child(label)
	var tween := create_tween()
	tween.parallel().tween_property(label, "position:y", label.position.y - 38.0, 0.55)
	tween.parallel().tween_property(label, "modulate:a", 0.0, 0.55)
	tween.tween_callback(label.queue_free)

func spawn_tracer(from: Vector2, to: Vector2, color: Color) -> void:
	var line := Line2D.new()
	line.width = 3.0
	line.default_color = color
	line.points = PackedVector2Array([from, to])
	line.z_index = 10
	add_child(line)
	var tween := create_tween()
	tween.tween_property(line, "modulate:a", 0.0, 0.12)
	tween.tween_callback(line.queue_free)

func combat_impact(center: Vector2, radius: float) -> void:
	var ring := Line2D.new()
	ring.width = 5.0
	ring.default_color = Color(1.0, 0.72, 0.25, 0.75)
	ring.position = center
	var points := PackedVector2Array()
	for i in 41:
		points.append(Vector2.from_angle(TAU * float(i) / 40.0) * radius)
	ring.points = points
	ring.scale = Vector2.ONE * 0.20
	ring.z_index = 5
	add_child(ring)
	var tween := create_tween()
	tween.parallel().tween_property(ring, "scale", Vector2.ONE, 0.18)
	tween.parallel().tween_property(ring, "modulate:a", 0.0, 0.24)
	tween.tween_callback(ring.queue_free)
