class_name Enemy
extends CombatActor

var role: String = "rotling"
var attack_damage: float = 10.0
var attack_period: float = 1.0
var attack_range: float = 46.0
var preferred_range: float = 0.0
var attack_cooldown: float = 0.0
var special_cooldown: float = 0.0
var target: CombatActor
var explosion_windup: float = 0.0
var resurrect_cooldown: float = 4.5
var boss_action: String = ""
var boss_windup: float = 0.0
var base_attack_period: float = 1.0
var base_move_speed: float = 100.0

func setup(enemy_role: String) -> void:
	role = enemy_role
	set_meta("role", role)
	match role:
		"rotling":
			display_name = "Rotling"
			max_hp = 55.0
			attack_damage = 10.0
			attack_period = 0.65
			move_speed = 175.0
			body_radius = 14.0
			base_color = Color(0.44, 0.75, 0.28)
		"boneguard":
			display_name = "Boneguard"
			max_hp = 220.0
			attack_damage = 35.0
			attack_period = 1.20
			move_speed = 92.0
			body_radius = 22.0
			base_color = Color(0.72, 0.72, 0.66)
		"archer":
			display_name = "Cultist Archer"
			max_hp = 80.0
			attack_damage = 18.0
			attack_period = 1.35
			attack_range = 285.0
			preferred_range = 235.0
			move_speed = 140.0
			body_radius = 16.0
			base_color = Color(0.74, 0.30, 0.52)
		"exploder":
			display_name = "Exploder"
			max_hp = 45.0
			attack_damage = 90.0
			attack_period = 10.0
			attack_range = 58.0
			move_speed = 225.0
			body_radius = 15.0
			base_color = Color(0.95, 0.30, 0.18)
		"necromancer":
			display_name = "Necromancer"
			max_hp = 150.0
			attack_damage = 14.0
			attack_period = 1.70
			attack_range = 250.0
			preferred_range = 220.0
			move_speed = 105.0
			body_radius = 19.0
			base_color = Color(0.55, 0.30, 0.78)
		"frenzied_boneguard":
			display_name = "Frenzied Boneguard"
			max_hp = 880.0
			attack_damage = 52.0
			attack_period = 1.05
			move_speed = 120.0
			body_radius = 30.0
			base_color = Color(0.90, 0.58, 0.16)
		"goremaw":
			display_name = "Goremaw"
			max_hp = 2500.0
			attack_damage = 64.0
			attack_period = 1.10
			move_speed = 105.0
			body_radius = 42.0
			base_color = Color(0.65, 0.12, 0.12)
			set_meta("role", "boss")
	hp = max_hp
	base_attack_period = attack_period
	base_move_speed = move_speed

func _ready() -> void:
	team = &"enemy"
	add_to_group("enemies")
	target = get_tree().get_first_node_in_group("player") as CombatActor
	special_cooldown = randf_range(2.5, 4.5)
	super._ready()

func _physics_process(delta: float) -> void:
	super._physics_process(delta)
	if dead:
		return
	attack_cooldown = maxf(0.0, attack_cooldown - delta)
	special_cooldown = maxf(0.0, special_cooldown - delta)
	resurrect_cooldown = maxf(0.0, resurrect_cooldown - delta)
	if target == null or not is_instance_valid(target) or target.dead:
		target = get_tree().get_first_node_in_group("player") as CombatActor
	if target == null:
		velocity = Vector2.ZERO
		move_and_slide()
		return

	if role == "exploder" and update_exploder(delta):
		move_and_slide()
		return
	if role == "goremaw" and update_boss(delta):
		move_and_slide()
		return
	if role == "necromancer":
		update_necromancer()
	if role == "frenzied_boneguard":
		update_frenzy()

	var distance := global_position.distance_to(target.global_position)
	if preferred_range > 0.0:
		if distance > preferred_range + 25.0:
			velocity = global_position.direction_to(target.global_position) * move_speed
		elif distance < preferred_range - 45.0:
			velocity = target.global_position.direction_to(global_position) * move_speed
		else:
			velocity = Vector2.ZERO
	else:
		if distance > attack_range:
			velocity = global_position.direction_to(target.global_position) * move_speed
		else:
			velocity = Vector2.ZERO

	if distance <= attack_range and attack_cooldown <= 0.0:
		perform_attack()
	move_and_slide()
	clamp_to_arena()

func perform_attack() -> void:
	if target == null or target.dead:
		return
	attack_cooldown = attack_period
	if role == "archer" or role == "necromancer":
		var scene := get_tree().current_scene
		if scene != null and scene.has_method("spawn_tracer"):
			scene.call("spawn_tracer", global_position, target.global_position, base_color)
	deal_player_damage(attack_damage)

func update_exploder(delta: float) -> bool:
	var distance := global_position.distance_to(target.global_position)
	if explosion_windup > 0.0:
		velocity = Vector2.ZERO
		explosion_windup -= delta
		queue_redraw()
		if explosion_windup <= 0.0:
			if distance <= 100.0:
				deal_player_damage(attack_damage)
			var scene := get_tree().current_scene
			if scene != null and scene.has_method("combat_impact"):
				scene.call("combat_impact", global_position, 100.0)
			last_overkill_ratio = 1.2
			die(self)
		return true
	if distance <= attack_range:
		explosion_windup = 0.80
		velocity = Vector2.ZERO
		queue_redraw()
		return true
	velocity = global_position.direction_to(target.global_position) * move_speed
	return false

func update_necromancer() -> void:
	if resurrect_cooldown > 0.0:
		return
	resurrect_cooldown = 5.0
	var living := 0
	for node in get_tree().get_nodes_in_group("enemies"):
		var enemy := node as CombatActor
		if enemy != null and not enemy.dead:
			living += 1
	var scene := get_tree().current_scene
	if living < 28 and scene != null and scene.has_method("spawn_enemy"):
		for i in 2:
			var offset := Vector2.from_angle(randf() * TAU) * randf_range(45.0, 80.0)
			scene.call("spawn_enemy", "rotling", global_position + offset)
	for node in get_tree().get_nodes_in_group("enemies"):
		var ally := node as CombatActor
		if ally != null and ally != self and not ally.dead and global_position.distance_to(ally.global_position) < 180.0:
			ally.heal(18.0)

func update_frenzy() -> void:
	var missing_chunks := int(floor((1.0 - health_ratio()) / 0.20))
	var multiplier := 1.0 + float(missing_chunks) * 0.08
	move_speed = base_move_speed * multiplier
	attack_period = base_attack_period / multiplier

func update_boss(delta: float) -> bool:
	if boss_action != "":
		boss_windup -= delta
		velocity = Vector2.ZERO
		queue_redraw()
		if boss_windup <= 0.0:
			resolve_boss_action()
		return true

	if special_cooldown <= 0.0:
		if randf() < 0.5:
			boss_action = "cleave"
			boss_windup = 0.65
		else:
			boss_action = "rupture"
			boss_windup = 0.85
		special_cooldown = randf_range(3.3, 4.8)
		queue_redraw()
		return true
	return false

func resolve_boss_action() -> void:
	if target == null or target.dead:
		boss_action = ""
		return
	var distance := global_position.distance_to(target.global_position)
	var scene := get_tree().current_scene
	if boss_action == "cleave":
		if distance <= 135.0:
			deal_player_damage(105.0)
			target.apply_knockback(global_position.direction_to(target.global_position), 340.0)
		if scene != null and scene.has_method("combat_impact"):
			scene.call("combat_impact", global_position, 135.0)
	elif boss_action == "rupture":
		if distance <= 225.0:
			deal_player_damage(82.0)
		if scene != null and scene.has_method("combat_impact"):
			scene.call("combat_impact", global_position, 225.0)
	boss_action = ""
	queue_redraw()

func deal_player_damage(amount: float) -> void:
	if target == null or target.dead:
		return
	var scene := get_tree().current_scene
	if scene != null and scene.has_method("register_damage_taken"):
		scene.call("register_damage_taken", amount)
	target.take_damage(amount, self, false)

func clamp_to_arena() -> void:
	global_position.x = clampf(global_position.x, 60.0, 1220.0)
	global_position.y = clampf(global_position.y, 100.0, 660.0)

func _draw() -> void:
	super._draw()
	match role:
		"archer":
			draw_line(Vector2(-10, 0), Vector2(18, 0), Color(1, 1, 1, 0.75), 3.0)
		"necromancer":
			draw_arc(Vector2.ZERO, body_radius + 8.0, 0.0, TAU, 24, Color(0.75, 0.45, 1.0, 0.7), 3.0)
		"frenzied_boneguard":
			draw_arc(Vector2.ZERO, body_radius + 8.0, 0.0, TAU, 24, Color(1.0, 0.38, 0.10, 0.8), 5.0)
		"goremaw":
			draw_arc(Vector2.ZERO, body_radius + 10.0, 0.0, TAU, 32, Color(1.0, 0.18, 0.10, 0.8), 6.0)
	if explosion_windup > 0.0:
		var pulse := 1.0 - (explosion_windup / 0.80)
		draw_arc(Vector2.ZERO, 100.0 * pulse, 0.0, TAU, 32, Color(1.0, 0.18, 0.08, 0.75), 5.0)
	if boss_action == "cleave":
		draw_arc(Vector2.ZERO, 135.0, -0.65, 0.65, 24, Color(1.0, 0.25, 0.12, 0.65), 8.0)
	elif boss_action == "rupture":
		draw_arc(Vector2.ZERO, 225.0, 0.0, TAU, 40, Color(1.0, 0.52, 0.12, 0.55), 8.0)
