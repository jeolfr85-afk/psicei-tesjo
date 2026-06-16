<?php
/**
 * Pestañas para cambiar entre Dirección Académica y Vinculación (admin o vista multi-área).
 *
 * @var string $currentArea
 * @var string $basePath ej. /prueba/prueba/MENU/resumen_area.php
 * @var string $role
 */
$allowedAreas = getAllowedInstitutionalAreas();
$basePath = $basePath ?? '';
$currentArea = $currentArea ?? '';
$role = $role ?? 'user';
?>
<nav class="area-tabs" aria-label="Seleccionar dirección">
  <?php foreach ($allowedAreas as $allowed): ?>
    <?php
      $isActive = $currentArea === $allowed;
      $href = $basePath . (str_contains($basePath, '?') ? '&' : '?') . 'area=' . rawurlencode($allowed);
    ?>
    <a class="area-tab<?php echo $isActive ? ' area-tab--active' : ''; ?>" href="<?php echo htmlspecialchars($href); ?>">
      <?php echo htmlspecialchars($allowed); ?>
    </a>
  <?php endforeach; ?>
</nav>
<style>
  .area-tabs {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin: 0 0 18px;
  }
  .area-tab {
    display: inline-flex;
    align-items: center;
    padding: 10px 16px;
    border-radius: 999px;
    border: 2px solid var(--ps-border, #cbd5e1);
    background: #fff;
    color: var(--ps-primary, #0b2f6a);
    font-weight: 700;
    font-size: 0.88rem;
    text-decoration: none;
    transition: background 0.2s, border-color 0.2s, color 0.2s;
  }
  .area-tab:hover {
    background: #f8fbff;
    border-color: #1d47A9;
  }
  .area-tab--active {
    background: linear-gradient(135deg, #00264D, #1d47A9);
    border-color: #00264D;
    color: #fff;
  }
</style>
