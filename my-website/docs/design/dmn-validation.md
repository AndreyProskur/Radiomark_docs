---
title: Валидация снимков (DMN)
sidebar_position: 4
description: DMN-таблица проверки корректности разметки и описания медицинских снимков для разных модальностей (рентген, КТ, МРТ).
---

# Валидация медицинских снимков (DMN)

Для проверки корректности разметки и описания снимков используется **Decision Model and Notation (DMN)**. Это позволяет централизовать и визуализировать сложную логику, зависящую от модальности (рентген, КТ, МРТ), не перегружая BPMN-схему.

Ниже приведена логика таблицы решений. Полный XML-код доступен в раскрывающемся блоке.

## Логика правил

| Модальность | Есть описание | Есть разметка | Дополнительные параметры | Решение |
|:-----------|:-------------|:-------------|:-------------------------|:-------|
| Любая | ❌ Нет | — | — | **REJECT:** Отсутствует описание |
| X-Ray | ✅ Да | ❌ Нет | — | **REJECT:** Требуется разметка |
| X-Ray | ✅ Да | ✅ Да | — | **APPROVE:** Готов к анализу |
| CT | ✅ Да | — | Не указан тип контраста | **REJECT:** Укажите контраст (None/Oral/IV/Oral+IV) |
| CT | ✅ Да | — | Не указана толщина среза | **REJECT:** Укажите толщину среза |
| CT | ✅ Да | — | Толщина среза > 3 мм | **WARNING:** Толстый срез, рекомендуется ручная проверка |
| CT | ✅ Да | — | Контраст указан + срез ≤ 3 мм | **APPROVE:** Готов к анализу |
| MRI | ✅ Да | ❌ Нет | — | **REJECT:** Требуется разметка для мягких тканей |
| MRI | ✅ Да | ✅ Да | Не указана взвешенность | **REJECT:** Укажите взвешенность (T1/T2/PD/FLAIR) |
| MRI | ✅ Да | ✅ Да | Некорректная взвешенность | **REJECT:** Недопустимое значение |
| MRI | ✅ Да | ✅ Да | Взвешенность указана корректно | **APPROVE:** Готов к анализу |

:::tip[Как это работает]
Система последовательно проверяет правила сверху вниз (hit policy: **FIRST**). Как только находится первое подходящее — выполняется соответствующее решение.
:::

<details>
<summary>📄 Показать XML-код DMN</summary>

```xml
<?xml version="1.0" encoding="UTF-8"?>
<definitions xmlns="http://www.omg.org/spec/DMN/20151101/dmn.xsd" 
             xmlns:camunda="http://camunda.org/schema/1.0/dmn" 
             id="definitions_imaging_validation" 
             name="Medical Imaging Validation Rules" 
             namespace="http://camunda.org/schema/1.0/dmn">
             
  <decision id="decision_imaging_check" name="Check Medical Image Validity">
    <decisionTable id="decisionTable_imaging" hitPolicy="FIRST">
    
      <input id="input_modality" label="Modality" camunda:inputVariable="modality">
        <inputExpression id="inputExpression_modality" typeRef="string">
          <text>modality</text>
        </inputExpression>
      </input>
      
      <input id="input_description" label="Has Description" camunda:inputVariable="hasDescription">
        <inputExpression id="inputExpression_description" typeRef="boolean">
          <text>hasDescription</text>
        </inputExpression>
      </input>
      
      <input id="input_markup" label="Has Markup" camunda:inputVariable="hasMarkup">
        <inputExpression id="inputExpression_markup" typeRef="boolean">
          <text>hasMarkup</text>
        </inputExpression>
      </input>
      
      <input id="input_weighting" label="Weighting (MRI)" camunda:inputVariable="weighting">
        <inputExpression id="inputExpression_weighting" typeRef="string">
          <text>weighting</text>
        </inputExpression>
      </input>
      
      <input id="input_contrast" label="Contrast" camunda:inputVariable="contrast">
        <inputExpression id="inputExpression_contrast" typeRef="string">
          <text>contrast</text>
        </inputExpression>
      </input>
      
      <input id="input_slice_thickness" label="Slice Thickness (mm)" camunda:inputVariable="sliceThickness">
        <inputExpression id="inputExpression_slice" typeRef="double">
          <text>sliceThickness</text>
        </inputExpression>
      </input>

      <output id="output_result" label="Decision" name="result" typeRef="string" />

      <!-- Универсальное правило: отсутствие описания -->
      <rule id="rule_no_description">
        <description>Description is necessary for all modalities</description>
        <inputEntry><text>"X-Ray", "CT", "MRI"</text></inputEntry>
        <inputEntry><text>false</text></inputEntry>
        <inputEntry><text>-</text></inputEntry>
        <inputEntry><text>-</text></inputEntry>
        <inputEntry><text>-</text></inputEntry>
        <inputEntry><text>-</text></inputEntry>
        <outputEntry><text>"REJECT: Description is missing"</text></outputEntry>
      </rule>

      <!-- Правила для рентгена -->
      <rule id="rule_xray_no_markup">
        <description>X-Ray requires markup</description>
        <inputEntry><text>"X-Ray"</text></inputEntry>
        <inputEntry><text>true</text></inputEntry>
        <inputEntry><text>false</text></inputEntry>
        <inputEntry><text>-</text></inputEntry>
        <inputEntry><text>-</text></inputEntry>
        <inputEntry><text>-</text></inputEntry>
        <outputEntry><text>"REJECT: Markup is required for X-Ray"</text></outputEntry>
      </rule>

      <rule id="rule_xray_ok">
        <description>X-Ray with description and markup</description>
        <inputEntry><text>"X-Ray"</text></inputEntry>
        <inputEntry><text>true</text></inputEntry>
        <inputEntry><text>true</text></inputEntry>
        <inputEntry><text>-</text></inputEntry>
        <inputEntry><text>-</text></inputEntry>
        <inputEntry><text>-</text></inputEntry>
        <outputEntry><text>"APPROVE: Ready for analysis"</text></outputEntry>
      </rule>

      <!-- Правила для КТ -->
      <rule id="rule_ct_no_contrast">
        <description>CT requires contrast specification</description>
        <inputEntry><text>"CT"</text></inputEntry>
        <inputEntry><text>true</text></inputEntry>
        <inputEntry><text>-</text></inputEntry>
        <inputEntry><text>-</text></inputEntry>
        <inputEntry><text>""</text></inputEntry>
        <inputEntry><text>-</text></inputEntry>
        <outputEntry><text>"REJECT: Contrast type is required for CT (None/Oral/IV/Oral+IV)"</text></outputEntry>
      </rule>

      <rule id="rule_ct_no_slice">
        <description>CT requires slice thickness</description>
        <inputEntry><text>"CT"</text></inputEntry>
        <inputEntry><text>true</text></inputEntry>
        <inputEntry><text>-</text></inputEntry>
        <inputEntry><text>-</text></inputEntry>
        <inputEntry><text>"None", "Oral", "IV", "Oral+IV"</text></inputEntry>
        <inputEntry><text>-</text></inputEntry>
        <outputEntry><text>"REJECT: Slice thickness is required for CT"</text></outputEntry>
      </rule>

      <rule id="rule_ct_thick_slice">
        <description>CT slice > 3mm requires radiologist attention</description>
        <inputEntry><text>"CT"</text></inputEntry>
        <inputEntry><text>true</text></inputEntry>
        <inputEntry><text>-</text></inputEntry>
        <inputEntry><text>-</text></inputEntry>
        <inputEntry><text>"None", "Oral", "IV", "Oral+IV"</text></inputEntry>
        <inputEntry><text>&gt;3.0</text></inputEntry>
        <outputEntry><text>"WARNING: Thick slice (>3mm) - manual review recommended"</text></outputEntry>
      </rule>

      <rule id="rule_ct_ok">
        <description>CT with all required parameters and optimal slice thickness</description>
        <inputEntry><text>"CT"</text></inputEntry>
        <inputEntry><text>true</text></inputEntry>
        <inputEntry><text>-</text></inputEntry>
        <inputEntry><text>-</text></inputEntry>
        <inputEntry><text>"None", "Oral", "IV", "Oral+IV"</text></inputEntry>
        <inputEntry><text>&lt;=3.0</text></inputEntry>
        <outputEntry><text>"APPROVE: Ready for analysis"</text></outputEntry>
      </rule>

      <!-- Правила для МРТ -->
      <rule id="rule_mri_no_markup">
        <description>MRI requires markup for soft tissue segmentation</description>
        <inputEntry><text>"MRI"</text></inputEntry>
        <inputEntry><text>true</text></inputEntry>
        <inputEntry><text>false</text></inputEntry>
        <inputEntry><text>-</text></inputEntry>
        <inputEntry><text>-</text></inputEntry>
        <inputEntry><text>-</text></inputEntry>
        <outputEntry><text>"REJECT: Markup is required for MRI"</text></outputEntry>
      </rule>

      <rule id="rule_mri_no_weighting">
        <description>MRI requires weighting specification</description>
        <inputEntry><text>"MRI"</text></inputEntry>
        <inputEntry><text>true</text></inputEntry>
        <inputEntry><text>true</text></inputEntry>
        <inputEntry><text>""</text></inputEntry>
        <inputEntry><text>-</text></inputEntry>
        <inputEntry><text>-</text></inputEntry>
        <outputEntry><text>"REJECT: Weighting is required for MRI (T1/T2/PD/FLAIR)"</text></outputEntry>
      </rule>
      
      <rule id="rule_mri_invalid_weighting">
        <description>MRI weighting must be T1, T2, PD, or FLAIR</description>
        <inputEntry><text>"MRI"</text></inputEntry>
        <inputEntry><text>true</text></inputEntry>
        <inputEntry><text>true</text></inputEntry>
        <inputEntry><text>not("T1", "T2", "PD", "FLAIR")</text></inputEntry>
        <inputEntry><text>-</text></inputEntry>
        <inputEntry><text>-</text></inputEntry>
        <outputEntry><text>"REJECT: Invalid weighting value"</text></outputEntry>
      </rule>
      
      <rule id="rule_mri_ok">
        <description>MRI with all required parameters</description>
        <inputEntry><text>"MRI"</text></inputEntry>
        <inputEntry><text>true</text></inputEntry>
        <inputEntry><text>true</text></inputEntry>
        <inputEntry><text>"T1", "T2", "PD", "FLAIR"</text></inputEntry>
        <inputEntry><text>"", "None"</text></inputEntry>
        <inputEntry><text>-</text></inputEntry>
        <outputEntry><text>"APPROVE: Ready for analysis"</text></outputEntry>
      </rule>

      <rule id="rule_mri_t1_contrast">
        <description>T1 with contrast</description>
        <inputEntry><text>"MRI"</text></inputEntry>
        <inputEntry><text>true</text></inputEntry>
        <inputEntry><text>true</text></inputEntry>
        <inputEntry><text>"T1"</text></inputEntry>
        <inputEntry><text>"IV"</text></inputEntry>
        <inputEntry><text>-</text></inputEntry>
        <outputEntry><text>"APPROVE: Ready for analysis"</text></outputEntry>
      </rule>

    </decisionTable>
  </decision>
  
  <inputData id="input_modality" name="Modality" />
  <inputData id="input_description" name="Has Description" />
  <inputData id="input_markup" name="Has Markup" />
  <inputData id="input_weighting" name="Weighting (MRI)" />
  <inputData id="input_contrast" name="Contrast" />
  <inputData id="input_slice_thickness" name="Slice Thickness" />
  
</definitions>
```
</details>
