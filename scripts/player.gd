class_name Vanguard
extends CombatActor

var target: CombatActor
var attack_cooldown: float = 0.0
var whirlwind_cooldown: float = 0.0
var slam_cooldown: float = 0.0
var whirlwind_time: float = 0.0
var whirlwind_tick: float = 0.0
var slam_windup: float = 0.0
var slam_pending: bool = false
var decision_timer: float = 0.0

const ATTACK_RANGE := 52.0
const ATTACK_DAMAGE_MIN := 35.0
const ATTACK_DAMAGE_MAX := 45.0
const ATTACK_PERIOD := 0.80
const CRIT_CHANCE := 0.05
const CRIT_MULT := 1.75

const WHIRLWIND_RADIUS := 94.0
const WHIRLWIND_DURATION := 1.50
const WHIRLWIND_DAMAGE := 30.0
const WHIRLWIND_COOLDOWN := 5.0
const WHIRLWIND_TICK_PERIOD := 0.25

const SLAM_RADIUS := 150.0
const SLAM_DAMAGE := 175.0
const SLAM_COOLDOWN := 7.0
const SLAM_WINDUP := 0.55

func _ready() -> void:
	team = &"player"
	display_name = "Vanguard"
	max_hp = 500.0
	hp = max_hp
	move_speed = 235.0
	body_radius = 22.0
	base_color = Color(0.26, 0.62, 1.0)
	add_to_group("player")
	super._ready()

func _physics_process(delta: float) -> void:
	super._physics_process(delta)
	if dead:
		return
	attack_cooldown = maxf(0.0, attack_cooldown - delta)
	whirlwind_cooldown = maxf(0.0, whirlwind_cooldown - delta)
	slam_cooldown = maxf(0.0, slam_cooldown - delta)
	decision_timer -= delta

	if slam_pending:
		velocity = Vector2.ZERO
		slam_windup -= delta
		if slam_windup <= 0.0:
			slam_pending = false
			execute_ground_slam()
		move_and_slide()
		return

	if whirlwind_time > 0.0:
		update_whirlwind(delta)
		move_and_slide()
		return

	if not is_instance_valid(target) or target.dead or decision_timer <= 0.0:
		target = choose_target()
		decision_timer = 0.15

	if target == null:
		velocity = Vector2.ZERO
		move_and_slide()
		return

	var distance := global_position.distance_to(target.global_position)
	var nearby := enemies_in_radius(SLAM_RADIUS)

	if slam_cooldown <= 0.0 and nearby.size() >= 4:
		begin_ground_slam()
	elif whirlwind_cooldown <= 0.0 and enemies_in_radius(WHIRLWIND_RADIUS).size() >= 3:
		begin_whirlwind()
	elif distance <= ATTACK_RANGE and attack_cooldown <= 0.0:
		basic_attack(target)
	else:
		var direction := global_position.direction_to(target.global_position)
		velocity = direction * move_speed

	move_and_slide()
	clamp_to_arena()

func choose_target() -> CombatActor:
	var best: CombatActor = null
	var best_score := -INF
	for node in get_tree().get_nodes_in_group("enemies"):
		var enemy := node as CombatActor
		if enemy == null or enemy.dead:
			continue
		var distance := global_position.distance_to(enemy.global_position)
		var score := 1000.0 - distance
		if enemy.has_meta("role"):
			match String(enemy.get_meta("role")):
				"exploder": score += 650.0
				"necromancer": score += 500.0
				"archer": score += 120.0
				"boss": score += 80.0
		if score > best_score:
			best_score = score
			best = enemy
	return best

func basic_attack(enemy: CombatActor) -> void:
	attack_cooldown = ATTACK_PERIOD
	var crit := randf() < CRIT_CHANCE
	var damage := randf_range(ATTACK_DAMAGE_MIN, ATTACK_DAMAGE_MAX)
	if crit:
		damage *= CRIT_MULT
	deal_damage(enemy, damage, crit, "Heavy Slash")
	if is_instance_valid(enemy):
		enemy.apply_knockback(global_position.direction_to(enemy.global_position), 70.0 if not crit else 135.0)

func begin_whirlwind() -> void:
	whirlwind_cooldown = WHIRLWIND_COOLDOWN
	whirlwind_time = WHIRLWIND_DURATION
	whirlwind_tick = 0.0
	queue_redraw()

func update_whirlwind(delta: float) -> void:
	whirlwind_time = maxf(0.0, whirlwind_time - delta)
	whirlwind_tick -= delta
	if target != null and is_instance_valid(target) and not target.dead:
		velocity = global_position.direction_to(target.global_position) * move_speed * 0.70
	else:
		velocity = velocity.move_toward(Vector2.ZERO, move_speed * delta * 4.0)
	if whirlwind_tick <= 0.0:
		whirlwind_tick = WHIRLWIND_TICK_PERIOD
		for enemy in enemies_in_radius(WHIRLWIND_RADIUS):
			deal_damage(enemy, WHIRLWIND_DAMAGE, false, "Whirlwind")
			if is_instance_valid(enemy):
				var pull_direction := enemy.global_position.direction_to(global_position)
				enemy.apply_knockback(pull_direction, 38.0)
	queue_redraw()

func begin_ground_slam() -> void:
	slam_cooldown = SLAM_COOLDOWN
	slam_pending = true
	slam_windup = SLAM_WINDUP
	velocity = Vector2.ZERO
	queue_redraw()

func execute_ground_slam() -> void:
	for enemy in enemies_in_radius(SLAM_RADIUS):
		deal_damage(enemy, SLAM_DAMAGE, false, "Ground Slam")
		if is_instance_valid(enemy):
			enemy.apply_knockback(global_position.direction_to(enemy.global_position), 430.0)
	var scene := get_tree().current_scene
	if scene != null and scene.has_method("combat_impact"):
		scene.call("combat_impact", global_position, SLAM_RADIUS)
	queue_redraw()

func deal_damage(enemy: CombatActor, amount: float, crit: bool, skill_name: String) -> void:
	if enemy == null or enemy.dead:
		return
	var scene := get_tree().current_scene
	if scene != null and scene.has_method("register_damage"):
		scene.call("register_damage", skill_name, amount)
	enemy.take_damage(amount, self, crit)

func enemies_in_radius(radius: float) -> Array[CombatActor]:
	var result: Array[CombatActor] = []
	for node in get_tree().get_nodes_in_group("enemies"):
		var enemy := node as CombatActor
		if enemy != null and not enemy.dead and global_position.distance_to(enemy.global_position) <= radius:
			result.append(enemy)
	return result

func clamp_to_arena() -> void:
	global_position.x = clampf(global_position.x, 70.0, 1210.0)
	global_position.y = clampf(global_position.y, 105.0, 650.0)

func _draw() -> void:
	super._draw()
	draw_line(Vector2(12, -4), Vector2(36, -20), Color(0.85, 0.90, 1.0), 6.0)
	if whirlwind_time > 0.0:
		draw_arc(Vector2.ZERO, WHIRLWIND_RADIUS, 0.0, TAU, 48, Color(0.55, 0.85, 1.0, 0.50), 5.0)
	if slam_pending:
		var progress := 1.0 - (slam_windup / SLAM_WINDUP)
		draw_arc(Vector2.ZERO, SLAM_RADIUS * progress, 0.0, TAU, 48, Color(1.0, 0.72, 0.20, 0.75), 7.0)
